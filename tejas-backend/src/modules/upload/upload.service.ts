import multer from "multer";
import path from "path";
import fs from "fs";
import { FileType } from "../../constants/types";
import { UploadRepository } from "./upload.repository";
import { sendToModel } from "../../lib/kalamClient";

const uploadRepository = new UploadRepository();

const dest = path.join("uploaded_files");
if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest, { recursive: true });
}

export const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dest),
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${file.originalname}`;
      cb(null, unique);
    },
  }),
});

export class UploadService {
  saveHeatQueryAll = async (filepath: string, sessionId: string) => {
    const record = await uploadRepository.createUploadRecord(filepath, FileType.heat_query_all, sessionId);

    const paired = await uploadRepository.getBySessionId(sessionId, FileType.heat_chem);
    if (paired) {
      const modelResult = await sendToModel(record.filepath, paired.filepath);
      return { record, modelResult };
    }

    return record;
  };

  saveGradeList = async (filepath: string, sessionId: string) => {
    return await uploadRepository.createUploadRecord(filepath, FileType.grade_list, sessionId);
  };

  saveScrapDataInventory = async (filepath: string, sessionId: string) => {
    return await uploadRepository.createUploadRecord(filepath, FileType.scrap_data_inventory, sessionId);
  };

  saveHeatQuerySchedule = async (filepath: string, sessionId: string) => {
    return await uploadRepository.createUploadRecord(filepath, FileType.heat_query_schedule, sessionId);
  };

  saveScrapChem = async (filepath: string, sessionId: string) => {
    return await uploadRepository.createUploadRecord(filepath, FileType.scrap_chem, sessionId);
  };

  saveHeatChem = async (filepath: string, sessionId: string) => {
    const record = await uploadRepository.createUploadRecord(filepath, FileType.heat_chem, sessionId);

    const paired = await uploadRepository.getBySessionId(sessionId, FileType.heat_query_all);
    if (paired) {
      const modelResult = await sendToModel(paired.filepath, record.filepath);
      return { record, modelResult };
    }

    return record;
  };
}