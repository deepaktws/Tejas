from pathlib import Path
import traceback
import sys

# Import your actual KF class/code here
# Example:
from Kalman_Scrap_Chemistry_Prediction import *

# HANDLE BOTH PYTHON + EXE
def get_runtime_path():
    if getattr(sys, 'frozen', False):
        return Path(sys.executable).parent   # for uploads/outputs
    return Path(__file__).parent

def get_bundle_path():
    if getattr(sys, 'frozen', False):
        return Path(sys._MEIPASS)   # for bundled files
    return Path(__file__).parent

RUNTIME_DIR = get_runtime_path()
BUNDLE_DIR = get_bundle_path()

scrap_limits_path = (
    RUNTIME_DIR / "uploads" / "Scrap_Cost_Chemistry_Limits.xlsx"
    if (RUNTIME_DIR / "uploads" / "Scrap_Cost_Chemistry_Limits.xlsx").exists()
    else BUNDLE_DIR / "uploads" / "Scrap_Cost_Chemistry_Limits.xlsx"
)

model_folder = BUNDLE_DIR / "Saved_Models"

# def run_kf_process(input_file, output_dir, target_chem, numb_heats_pass):
def run_kf_process(
    input_file,
    output_dir,
    target_chem,
    numb_heats_pass,
    chemistry_file_path=None,
    input_ext=None,
    csv_encoding=None,
    return_payload=False,
):
    try:
        model_names = ["LinearRegression_ScrapModel_Cu.pkl"]

        cfg = ScrapKalmanConfig(
            input_data_path=Path(input_file),
            scrap_limits_path=scrap_limits_path,
            model_folder=model_folder,  # ✅ HARD CODED
            model_names=model_names,
            selected_model_name=model_names[0],
            target_chem=target_chem,
            numb_heats_pass=int(numb_heats_pass),
            output_dir=Path(output_dir),
            apply_scaling_mode="manual",
            scaler_type="standard",
            use_previous_kf=False,
            csv_encoding=csv_encoding,
        )

        cfg.chemistry_file_path = chemistry_file_path
        cfg.input_ext = input_ext   # NEW

        # 🔥 CALL YOUR KF MAIN FUNCTION HERE
        runner = KalmanFilterScrapChemistry(cfg)
        runner.run()

        payload = {
            "kf_coef_df": getattr(runner, "kf_coef_df", None),
            "kf_prediction_df": getattr(runner, "kf_prediction_df", None),
        }

        if return_payload:
            return True, "Kalman Filter Prediction Successfully Completed", payload

        return True, "Kalman Filter Prediction Successfully Completed"

    except Exception as e:
        if return_payload:
            return False, str(e) + "\n" + traceback.format_exc(), {}
        return False, str(e) + "\n" + traceback.format_exc()