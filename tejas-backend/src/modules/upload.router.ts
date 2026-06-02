import { Router } from "express";
import { UploadController } from "./upload.controller";
import { uploadHeatQueryAll, uploadHeatQuerySchedule } from "./upload.service";

const UploadRouter = Router();
const controller = new UploadController();

UploadRouter.post(
  "/heat-query-all",
  uploadHeatQueryAll.single("file"),
  controller.uploadHeatQueryAll
);

UploadRouter.post("/heat-query-schedule", uploadHeatQuerySchedule.single("file"), controller.uploadHeatQuerySchedule);

export default UploadRouter;