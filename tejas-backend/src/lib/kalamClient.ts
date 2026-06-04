import fs from "fs";
import path from "path";
import FormData from "form-data";
import axios from "axios";
import { config } from "../config";
export const sendToModel = async (
  heatQueryAllPath: string,
  heatChemPath: string,
  targetChem: string = "ALL",
  numbHeatPass: number = 1,
  returnFormat: string = "both"
) => {
  // step 1 - upload both files
  const formData = new FormData();
  formData.append("file1", fs.createReadStream(heatQueryAllPath), path.basename(heatQueryAllPath).replace(/^\d+-/, ""));
  formData.append("file2", fs.createReadStream(heatChemPath), path.basename(heatChemPath).replace(/^\d+-/, ""));

  const uploadRes = await axios.post(`${config.FLASK_BASE_URL}/upload`, formData, {
    headers: formData.getHeaders(),
  });

  if (!uploadRes.data.success) {
    throw new Error(`Flask upload failed: ${uploadRes.data.message}`);
  }

  // step 2 - trigger model run
  const runRes = await axios.post(`${config.FLASK_BASE_URL}/run`, {
    target_chem: targetChem,
    numb_heats_pass: numbHeatPass,
    return_format: returnFormat,
  }, {
    maxContentLength: Infinity,
    maxBodyLength: Infinity,
    timeout: 120000,
    validateStatus: () => true,
  });

  if (runRes.status !== 200) {
    throw new Error(`Flask /run failed: ${JSON.stringify(runRes.data)}`);
  }

  return runRes.data;
};