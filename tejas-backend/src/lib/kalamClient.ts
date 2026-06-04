import fs from "fs";
import FormData from "form-data";

const FLASK_BASE_URL = process.env.FLASK_BASE_URL ?? "http://127.0.0.1:5000";

export const sendToModel = async (
  heatQueryAllPath: string,
  heatChemPath: string,
  targetChem: string = "ALL",
  numbHeatPass: number = 1,
  returnFormat: string = "both"
) => {
  // step 1 - upload both files
  const formData = new FormData();
  formData.append("file1", fs.createReadStream(heatQueryAllPath));
  formData.append("file2", fs.createReadStream(heatChemPath));

  const uploadRes = await fetch(`${FLASK_BASE_URL}/upload`, {
    method: "POST",
    body: formData as any,
    headers: formData.getHeaders(),
  });

  const uploadData = await uploadRes.json() as { success: boolean; message: string };

  if (!uploadData.success) {
    throw new Error(`Flask upload failed: ${uploadData.message}`);
  }

  // step 2 - trigger model run
  const runRes = await fetch(`${FLASK_BASE_URL}/run`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      target_chem: targetChem,
      numb_heats_pass: numbHeatPass,
      return_format: returnFormat,
    }),
  });

  return await runRes.json();
};