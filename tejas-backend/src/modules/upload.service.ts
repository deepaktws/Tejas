import multer from "multer";
import path from "path";
import fs from "fs";

const createStorage = (folder: string) => {
  const dest = path.join("tmp", "uploads", folder);
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  return multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, dest),
    filename: (_req, file, cb) => {
      const unique = `${Date.now()}-${file.originalname}`;
      cb(null, unique);
    },
  });
};

export const uploadHeatQueryAll = multer({
  storage: createStorage("heat-query-all"),
});

export const uploadHeatQuerySchedule = multer({ storage: createStorage("heat-query-schedule") });