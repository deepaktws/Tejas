import { Router } from "express";
import { UploadController } from "./upload.controller";
import { uploadHeatQueryAll } from "./upload.service";

const UploadRouter = Router();
const controller = new UploadController();

UploadRouter.post(
  "/heat-query-all",
  uploadHeatQueryAll.single("file"),
  controller.uploadHeatQueryAll
);

export default UploadRouter;