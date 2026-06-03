import { Router } from "express";
import { UploadController } from "./upload.controller";
import { uploadHeatQueryAll, uploadHeatQuerySchedule, uploadScrapChem } from "./upload.service";

const UploadRouter = Router();
const controller = new UploadController();

UploadRouter.post(
  "/heat-query-all",
  uploadHeatQueryAll.single("file"),
  controller.uploadHeatQueryAll
);

UploadRouter.post("/heat-query-schedule", uploadHeatQuerySchedule.single("file"), controller.uploadHeatQuerySchedule);
UploadRouter.post("/scrap-chem", uploadScrapChem.single("file"), controller.uploadScrapChem);

export default UploadRouter;