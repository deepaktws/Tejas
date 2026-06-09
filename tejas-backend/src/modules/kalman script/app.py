import base64
import sys
import threading
import webbrowser
from pathlib import Path

import pandas as pd
from flask import Flask, jsonify, render_template, request, send_file

from Future_Heats_Run import run_planner
from kf_runner import resolve_config_file, resolve_uploads_dir, run_kf_configuration

app = Flask(__name__)

uploaded_file_paths = {}
planner_file_paths = {}
last_kf_output_file = None


def get_base_path():
    if getattr(sys, "frozen", False):
        return Path(sys.executable).parent
    return Path(__file__).parent


BASE_DIR = get_base_path()
OUTPUT_FOLDER = BASE_DIR / "outputs"
OUTPUT_FOLDER.mkdir(parents=True, exist_ok=True)


def cleanup_kf_outputs(output_folder):
    try:
        patterns = [
            "KF_Scarp_Chemistry_File_*.xlsx",
            "KF_*_Prediction_*.xlsx",
            "KF_*_Prediction_*.csv",
            "pred_vs_actual_*.png",
        ]
        deleted = []
        for pattern in patterns:
            for file_path in Path(output_folder).glob(pattern):
                try:
                    file_path.unlink()
                    deleted.append(file_path.name)
                except Exception as e:
                    print(f"Failed to delete {file_path.name}: {e}")
        print(f"KF output cleanup done. Deleted {len(deleted)} files")
    except Exception as e:
        print(f"KF cleanup failed: {e}")


def build_file_response(output_path: Path, return_format: str, success_message: str, extra=None):
    output_path = Path(output_path)

    if return_format == "file":
        if not output_path.exists():
            return jsonify({"success": False, "message": f"Output file not found: {output_path.name}"}), 404
        return send_file(
            output_path,
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            as_attachment=True,
            download_name=output_path.name,
        )

    payload = {
        "success": True,
        "message": success_message,
        "output_filename": output_path.name if output_path.exists() else None,
        "output_path": str(output_path) if output_path.exists() else None,
    }
    if extra:
        payload.update(extra)

    if return_format in ("both", "json") and output_path.exists():
        if return_format == "both":
            with open(output_path, "rb") as f:
                file_b64 = base64.b64encode(f.read()).decode("utf-8")
            payload["output_file"] = {
                "filename": output_path.name,
                "content_base64": file_b64,
                "mime_type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }

    return jsonify(payload)


def read_tabular_upload(file_storage, label: str) -> pd.DataFrame:
    if file_storage is None or not file_storage.filename:
        raise ValueError(f"Missing required file: {label}")

    suffix = Path(file_storage.filename).suffix.lower()
    if suffix == ".csv":
        return pd.read_csv(file_storage)
    if suffix in (".xlsx", ".xls", ".xlsm"):
        return pd.read_excel(file_storage)
    raise ValueError(f"{label}: unsupported file type '{suffix}' (use .csv or .xlsx)")


def open_browser():
    webbrowser.open("http://127.0.0.1:5000")


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/upload", methods=["POST"])
def upload_file():
    """Upload HeatQuery_All + HeatQuery_Chemistry for KF /run."""
    global uploaded_file_paths

    file1 = request.files.get("file1")
    file2 = request.files.get("file2")

    if not file1 or not file2:
        return jsonify({"success": False, "message": "Please upload both files"}), 400

    f1_name = file1.filename
    f2_name = file2.filename

    if f1_name == f2_name:
        return jsonify({"success": False, "message": "Same file uploaded twice."}), 400

    if not (
        (f1_name.startswith("HeatQuery_All_") and f2_name.startswith("HeatQuery_Chemistry_"))
        or (f2_name.startswith("HeatQuery_All_") and f1_name.startswith("HeatQuery_Chemistry_"))
    ):
        return jsonify({
            "success": False,
            "message": "Upload HeatQuery_All_* and HeatQuery_Chemistry_* files.",
        }), 400

    uploads_dir = resolve_uploads_dir()
    uploads_dir.mkdir(parents=True, exist_ok=True)

    path1 = uploads_dir / f1_name
    path2 = uploads_dir / f2_name
    file1.save(path1)
    file2.save(path2)

    if f1_name.startswith("HeatQuery_All_"):
        all_file, chem_file = path1, path2
    else:
        all_file, chem_file = path2, path1

    uploaded_file_paths = {"all_file": all_file, "chem_file": chem_file}

    return jsonify({
        "success": True,
        "filename": f"{all_file.name}\n{chem_file.name}",
    })


@app.route("/run", methods=["POST"])
def run_kf():
    """
    KF-only endpoint. Runs Kalman configuration (single chem or ALL).
    Returns KF_Scarp_Chemistry_File_{heat_id}.xlsx — does NOT call planner.
    """
    global last_kf_output_file

    cleanup_kf_outputs(OUTPUT_FOLDER)

    data = request.json or {}
    target_chem_ui = data.get("target_chem", "Cu")
    numb_heats_pass = data.get("numb_heats_pass", 1)
    return_format = data.get("return_format", "both")

    if not uploaded_file_paths.get("all_file"):
        return jsonify({"success": False, "message": "Upload HeatQuery files first via POST /upload"}), 400

    input_file = uploaded_file_paths["all_file"]
    input_ext = input_file.suffix.lower()
    if input_ext not in (".xlsx", ".csv"):
        return jsonify({"success": False, "message": "Only .xlsx or .csv input supported"}), 400

    try:
        success, message, output_file = run_kf_configuration(
            input_file=input_file,
            chemistry_file_path=uploaded_file_paths["chem_file"],
            output_dir=OUTPUT_FOLDER,
            target_chem_ui=target_chem_ui,
            numb_heats_pass=numb_heats_pass,
            input_ext=input_ext,
        )
    except Exception as e:
        return jsonify({"success": False, "phase": "kalman", "message": str(e)}), 500

    if not success:
        return jsonify({"success": False, "phase": "kalman", "message": message}), 422

    if output_file is None or not Path(output_file).exists():
        return jsonify({
            "success": False,
            "phase": "kalman",
            "message": "Kalman completed but output workbook was not created.",
        }), 500

    last_kf_output_file = Path(output_file)

    return build_file_response(
        last_kf_output_file,
        return_format,
        message,
        extra={"target_chem": target_chem_ui, "numb_heats_pass": numb_heats_pass},
    )


@app.route("/planner/upload", methods=["POST"])
def upload_planner_files():
    """
    Upload inputs for POST /planner (optional two-step flow).
    Files: heat_query, scrap_inventory, kf_file (optional if /run was done), grade_spec (optional).
    """
    global planner_file_paths

    uploads_dir = resolve_uploads_dir()
    uploads_dir.mkdir(parents=True, exist_ok=True)

    saved = {}

    for field in ("heat_query", "scrap_inventory", "kf_file", "grade_spec"):
        f = request.files.get(field)
        if f and f.filename:
            dest = uploads_dir / f.filename
            f.save(dest)
            saved[field] = str(dest)

    if "heat_query" not in saved:
        return jsonify({"success": False, "message": "heat_query file is required"}), 400
    if "scrap_inventory" not in saved:
        return jsonify({"success": False, "message": "scrap_inventory file is required"}), 400

    planner_file_paths = saved

    return jsonify({"success": True, "files": saved})


@app.route("/planner", methods=["POST"])
def run_planner_api():
    """
    Independent planner endpoint. Does NOT run Kalman.
    Accepts multipart files or JSON with return_format; uses /planner/upload cache when files omitted.
    """
    global planner_file_paths, last_kf_output_file

    return_format = "both"
    if request.is_json:
        return_format = (request.json or {}).get("return_format", "both")
    elif request.form.get("return_format"):
        return_format = request.form.get("return_format")

    try:
        if request.files:
            heat_query_df = read_tabular_upload(request.files.get("heat_query"), "heat_query")
            scrap_df = read_tabular_upload(request.files.get("scrap_inventory"), "scrap_inventory")

            grade_file = request.files.get("grade_spec")
            if grade_file and grade_file.filename:
                grade_spec_df = read_tabular_upload(grade_file, "grade_spec")
            else:
                grade_path = resolve_config_file("Grade_Specifications.xlsx")
                if not grade_path.exists():
                    return jsonify({"success": False, "message": "grade_spec file required or missing in Uploads/"}), 400
                grade_spec_df = pd.read_excel(grade_path)

            kf_upload = request.files.get("kf_file")
            if kf_upload and kf_upload.filename:
                kf_dest = OUTPUT_FOLDER / kf_upload.filename
                kf_upload.save(kf_dest)
                kf_source = kf_dest
            elif last_kf_output_file and Path(last_kf_output_file).exists():
                kf_source = last_kf_output_file
            else:
                return jsonify({
                    "success": False,
                    "message": "kf_file required (upload or run POST /run first in same session)",
                }), 400
        else:
            if not planner_file_paths.get("heat_query") or not planner_file_paths.get("scrap_inventory"):
                return jsonify({
                    "success": False,
                    "message": "Upload planner files via POST /planner/upload or send multipart to POST /planner",
                }), 400

            heat_path = Path(planner_file_paths["heat_query"])
            scrap_path = Path(planner_file_paths["scrap_inventory"])

            heat_query_df = pd.read_csv(heat_path) if heat_path.suffix.lower() == ".csv" else pd.read_excel(heat_path)
            scrap_df = pd.read_excel(scrap_path)

            if planner_file_paths.get("grade_spec"):
                grade_path = Path(planner_file_paths["grade_spec"])
                grade_spec_df = pd.read_csv(grade_path) if grade_path.suffix.lower() == ".csv" else pd.read_excel(grade_path)
            else:
                grade_path = resolve_config_file("Grade_Specifications.xlsx")
                if not grade_path.exists():
                    return jsonify({"success": False, "message": "grade_spec missing"}), 400
                grade_spec_df = pd.read_excel(grade_path)

            if planner_file_paths.get("kf_file"):
                kf_source = Path(planner_file_paths["kf_file"])
            elif last_kf_output_file and Path(last_kf_output_file).exists():
                kf_source = last_kf_output_file
            else:
                return jsonify({"success": False, "message": "kf_file missing"}), 400

        output_file, _ = run_planner(
            heat_query=heat_query_df,
            scrap_availability_df=scrap_df,
            grade_spec_df=grade_spec_df,
            kf_source=kf_source,
            output_dir=OUTPUT_FOLDER,
        )

    except Exception as e:
        return jsonify({"success": False, "phase": "planner", "message": str(e)}), 500

    return build_file_response(
        Path(output_file),
        return_format,
        "Planner optimization completed",
    )


if __name__ == "__main__":
    threading.Timer(1.5, open_browser).start()
    app.run(host="127.0.0.1", port=5000, debug=False)
