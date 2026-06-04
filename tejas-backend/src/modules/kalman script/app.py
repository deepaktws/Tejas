import base64
import re
import sys
import threading
import webbrowser
from pathlib import Path

import pandas as pd
from flask import Flask, jsonify, render_template, request, send_file

from kf_runner import run_kf_process
from run_optimization import run_optimization_pulp, run_heatwise_optimization

app = Flask(__name__)

uploaded_file_paths = {}
kf_runtime_cache = {}


def get_base_path():
    if getattr(sys, "frozen", False):
        return Path(sys.executable).parent
    return Path(__file__).parent


BASE_DIR = get_base_path()

UPLOAD_FOLDER = BASE_DIR / "uploads"
OUTPUT_FOLDER = BASE_DIR / "outputs"

UPLOAD_FOLDER.mkdir(parents=True, exist_ok=True)
OUTPUT_FOLDER.mkdir(parents=True, exist_ok=True)


def resolve_uploads_dir() -> Path:
    """Prefer lowercase uploads/, fall back to Uploads/ (repo default)."""
    for name in ("uploads", "Uploads"):
        candidate = BASE_DIR / name
        if candidate.exists():
            return candidate
    return UPLOAD_FOLDER


def resolve_upload_file(filename: str) -> Path:
    uploads_dir = resolve_uploads_dir()
    runtime_path = Path(sys.executable).parent if getattr(sys, "frozen", False) else Path(__file__).parent
    bundle_path = Path(sys._MEIPASS) if getattr(sys, "frozen", False) else runtime_path

    for base in (uploads_dir, runtime_path / "uploads", runtime_path / "Uploads", bundle_path / "uploads", bundle_path / "Uploads"):
        candidate = base / filename
        if candidate.exists():
            return candidate
    return uploads_dir / filename


def is_per_heat_kf_workbook(path: Path) -> bool:
    """True for KF_Scrap_Type_Predictions_{heat_id}.xlsx, not chem-level aggregate names."""
    return path.stem.split("_")[-1].isdigit()


def list_per_heat_kf_workbooks(output_dir: Path) -> list[Path]:
    output_dir = Path(output_dir)
    return sorted(
        p for p in output_dir.glob("KF_Scrap_Type_Predictions_*.xlsx") if is_per_heat_kf_workbook(p)
    )


def cleanup_tracker_files(output_folder):
    try:
        che_tracker = output_folder / "che_tracker_df.xlsx"
        target_tracker = output_folder / "target_tracker_df.xlsx"

        if che_tracker.exists():
            che_tracker.unlink()

        if target_tracker.exists():
            target_tracker.unlink()

        print("Tracker files cleaned at start")

    except Exception as e:
        print(f"Cleanup failed: {e}")


def cleanup_model_outputs(output_folder):
    try:
        patterns = [
            "KF_*_Prediction_*.xlsx",
            "KF_*_Prediction_*.csv",
            "KF_Scrap_Type_Predictions_*.xlsx",
            "KF_Scrap_Type_Predictions_*.csv",
            "Scrap_Optimization_Output_*.xlsx",
            "Scrap_Optimization_Output_*.csv",
            "pred_vs_actual_*.png",
        ]

        deleted_files = []

        for pattern in patterns:
            for file_path in output_folder.glob(pattern):
                try:
                    file_path.unlink()
                    deleted_files.append(file_path.name)
                except Exception as e:
                    print(f"Failed to delete {file_path.name}: {e}")

        print(f"Model output cleanup done. Deleted {len(deleted_files)} files")

    except Exception as e:
        print(f"Cleanup failed: {e}")


def clean_col(col):
    col = str(col)
    col = col.replace("\xa0", " ")
    col = col.strip()
    col = re.sub(r"\s+", " ", col)
    return col


def load_recommendation_input_from_kf_outputs(output_dir: Path):
    output_dir = Path(output_dir)
    heat_files = list_per_heat_kf_workbooks(output_dir)

    if not heat_files:
        raise FileNotFoundError(
            "No per-heat KF workbooks found in outputs folder. Run Kalman prediction first."
        )

    file_path = heat_files[0]

    try:
        df = pd.read_excel(file_path, sheet_name="Input")
        df.columns = [clean_col(c) for c in df.columns]
    except ValueError:
        df = pd.read_excel(file_path)
        df.columns = [clean_col(c) for c in df.columns]

    target_df = pd.read_excel(file_path, sheet_name="Target")
    param_df = pd.read_excel(file_path, sheet_name="Parameters")
    target_df.columns = [clean_col(c) for c in target_df.columns]
    param_df.columns = [clean_col(c) for c in param_df.columns]

    return df, target_df, param_df, file_path


def get_mapping_file_path() -> Path:
    return resolve_upload_file("Scrap_Cost_Chemistry_Limits.xlsx")


def execute_recommendation_flow(target_chem_ui: str, numb_heats_pass, input_ext: str) -> dict:
    global kf_runtime_cache

    output_dir = OUTPUT_FOLDER
    df, target_df, param_df, source_file = load_recommendation_input_from_kf_outputs(output_dir)

    print(f"Recommendation input loaded from: {source_file.name}")

    try:
        run_optimization_pulp(df, target_df, param_df, return_json=True)
    except Exception:
        pass

    mapping_file_path = get_mapping_file_path()
    target_list = ["Cu", "Ni", "Sn", "Cr", "P"] if target_chem_ui == "ALL" else [target_chem_ui]

    all_scrap = []
    all_chem = []
    actual_cost = None
    suggested_cost = None
    output_files = []

    for target_chem in target_list:
        chem_cache = kf_runtime_cache.get(target_chem, {})
        kf_coef_df = chem_cache.get("kf_coef_df")
        kf_pred_df = chem_cache.get("kf_prediction_df")

        if kf_coef_df is None or kf_pred_df is None:
            raise ValueError(
                f"KF in-memory data missing for {target_chem}. "
                "Run the full /run pipeline in the same session before recommendation."
            )

        print(f"Running heatwise optimization for {target_chem}")

        scrap_json, chem_json, actual_cost, suggested_cost, output_path = run_heatwise_optimization(
            df_input=df,
            target_chem=target_chem,
            output_dir=output_dir,
            mapping_file_path=mapping_file_path,
            kf_output_file_path=None,
            kf_coef_df=kf_coef_df,
            kf_pred_df=kf_pred_df,
            target_df=target_df,
            param_df=param_df,
            input_file_path=uploaded_file_paths["all_file"],
            input_ext=input_ext,
            numb_heats_pass=numb_heats_pass,
        )

        if output_path is not None:
            output_files.append(Path(output_path))

        if scrap_json and len(scrap_json) > 0 and "Scrap Type" in scrap_json[0]:
            all_scrap = scrap_json
            all_chem = chem_json

    kf_heat_workbooks = list_per_heat_kf_workbooks(output_dir)

    if not all_scrap:
        return {
            "success": True,
            "message": "No Solution Found by Optimizer",
            "scrap_table": [],
            "chem_table": [],
            "actual_cost": None,
            "suggested_cost": None,
            "output_files": output_files,
            "kf_heat_workbooks": kf_heat_workbooks,
        }

    return {
        "success": True,
        "message": f"Optimization completed for {'ALL' if target_chem_ui == 'ALL' else target_chem_ui}",
        "scrap_table": all_scrap,
        "chem_table": all_chem,
        "actual_cost": actual_cost,
        "suggested_cost": suggested_cost,
        "output_files": output_files,
        "kf_heat_workbooks": kf_heat_workbooks,
    }


def build_run_response(reco_result: dict, kf_message: str, return_format: str, input_ext: str):
    output_files = reco_result.get("output_files") or []
    output_path = output_files[-1] if output_files else None

    if return_format == "file":
        if output_path is None or not output_path.exists():
            return jsonify({
                "success": False,
                "message": "No optimization output file available to download",
                "kf_message": kf_message,
            }), 404

        mimetype = (
            "text/csv"
            if output_path.suffix.lower() == ".csv"
            else "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        return send_file(
            output_path,
            mimetype=mimetype,
            as_attachment=True,
            download_name=output_path.name,
        )

    payload = {
        "success": reco_result["success"],
        "message": reco_result["message"],
        "kf_message": kf_message,
        "scrap_table": reco_result["scrap_table"],
        "chem_table": reco_result["chem_table"],
        "actual_cost": reco_result["actual_cost"],
        "suggested_cost": reco_result["suggested_cost"],
        "output_filename": output_path.name if output_path else None,
        "kf_heat_workbooks": [p.name for p in reco_result.get("kf_heat_workbooks", [])],
    }

    if return_format == "both" and output_path is not None and output_path.exists():
        mimetype = (
            "text/csv"
            if output_path.suffix.lower() == ".csv"
            else "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
        with open(output_path, "rb") as f:
            file_b64 = base64.b64encode(f.read()).decode("utf-8")
        payload["output_file"] = {
            "filename": output_path.name,
            "content_base64": file_b64,
            "mime_type": mimetype,
        }

    return jsonify(payload)


def open_browser():
    webbrowser.open("http://127.0.0.1:5000")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/upload", methods=["POST"])
def upload_file():
    global uploaded_file_paths

    file1 = request.files.get("file1")
    file2 = request.files.get("file2")

    if not file1 or not file2:
        return jsonify({"success": False, "message": "Please upload both files"})

    f1_name = file1.filename
    f2_name = file2.filename

    if f1_name == f2_name:
        return jsonify({"success": False, "message": "Same file uploaded twice. Please upload two different files."})

    if not (
        (f1_name.startswith("HeatQuery_All_") and f2_name.startswith("HeatQuery_Chemistry_"))
        or (f2_name.startswith("HeatQuery_All_") and f1_name.startswith("HeatQuery_Chemistry_"))
    ):
        return jsonify({
            "success": False,
            "message": "Upload correct files:\n1. HeatQuery_All_*\n2. HeatQuery_Chemistry_*",
        })

    uploads_dir = resolve_uploads_dir()
    uploads_dir.mkdir(parents=True, exist_ok=True)

    path1 = uploads_dir / f1_name
    path2 = uploads_dir / f2_name

    file1.save(path1)
    file2.save(path2)

    if f1_name.startswith("HeatQuery_All_"):
        all_file = path1
        chem_file = path2
    else:
        all_file = path2
        chem_file = path1

    uploaded_file_paths = {
        "all_file": all_file,
        "chem_file": chem_file,
    }

    return jsonify({
        "success": True,
        "filename": f"{all_file.name}\n{chem_file.name}",
    })


@app.route("/run", methods=["POST"])
def run_kf():
    cleanup_model_outputs(OUTPUT_FOLDER)
    cleanup_tracker_files(OUTPUT_FOLDER)

    global kf_runtime_cache
    kf_runtime_cache = {}

    data = request.json or {}
    target_chem_ui = data.get("target_chem", "Cu")
    numb_heats_pass = data.get("numb_heats_pass", 1)
    return_format = data.get("return_format", "both")

    if not uploaded_file_paths.get("all_file"):
        return jsonify({"success": False, "message": "Upload HeatQuery files first"}), 400

    input_file = uploaded_file_paths["all_file"]
    input_ext = input_file.suffix.lower()

    if input_ext not in [".xlsx", ".csv"]:
        return jsonify({"success": False, "message": "Only .xlsx or .csv files are supported"}), 400

    try:
        if target_chem_ui == "ALL":
            results = []

            for chem in ["Cu", "Ni", "Sn", "Cr", "P"]:
                print(f"Running KF for target chem: {chem} (numb_heats_pass={numb_heats_pass})")
                success, message, payload = run_kf_process(
                    input_file=input_file,
                    output_dir=OUTPUT_FOLDER,
                    target_chem=chem,
                    numb_heats_pass=numb_heats_pass,
                    chemistry_file_path=uploaded_file_paths["chem_file"],
                    input_ext=input_ext,
                    return_payload=True,
                )
                kf_runtime_cache[chem] = payload or {}
                results.append((chem, success, message))

            kf_success = all(r[1] for r in results)
            kf_message = "\n".join([f"{chem}: {msg}" for chem, _, msg in results])
        else:
            kf_success, kf_message, payload = run_kf_process(
                input_file=input_file,
                output_dir=OUTPUT_FOLDER,
                target_chem=target_chem_ui,
                numb_heats_pass=numb_heats_pass,
                chemistry_file_path=uploaded_file_paths["chem_file"],
                input_ext=input_ext,
                return_payload=True,
            )
            kf_runtime_cache[target_chem_ui] = payload or {}
    except Exception as e:
        return jsonify({"success": False, "phase": "kalman", "message": str(e)}), 500

    if not kf_success:
        return jsonify({"success": False, "phase": "kalman", "message": kf_message}), 422

    try:
        reco_result = execute_recommendation_flow(
            target_chem_ui=target_chem_ui,
            numb_heats_pass=numb_heats_pass,
            input_ext=input_ext,
        )
    except Exception as e:
        return jsonify({
            "success": False,
            "phase": "recommendation",
            "message": str(e),
            "kf_message": kf_message,
        }), 500

    return build_run_response(reco_result, kf_message, return_format, input_ext)


@app.route("/run_recommendation", methods=["POST"])
def run_recommendation():
    cleanup_tracker_files(OUTPUT_FOLDER)

    if not uploaded_file_paths.get("all_file"):
        return jsonify({"success": False, "message": "Upload HeatQuery files first"}), 400

    if request.is_json:
        data = request.json or {}
        target_chem_ui = data.get("target_chem", "Cu")
        numb_heats_pass = data.get("numb_heats_pass", 1)
        return_format = data.get("return_format", "json")
    else:
        target_chem_ui = request.form.get("target_chem", "Cu")
        numb_heats_pass = request.form.get("numb_heats_pass", 1)
        return_format = request.form.get("return_format", "json")

    input_ext = uploaded_file_paths["all_file"].suffix.lower()

    try:
        reco_result = execute_recommendation_flow(
            target_chem_ui=target_chem_ui,
            numb_heats_pass=numb_heats_pass,
            input_ext=input_ext,
        )
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

    return build_run_response(reco_result, "Recommendation run (KF files already present)", return_format, input_ext)


if __name__ == "__main__":
    threading.Timer(1.5, open_browser).start()
    app.run(host="127.0.0.1", port=5000, debug=False)
