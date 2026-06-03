import { Router } from "express";
import { UploadController } from "./upload.controller";
import { uploadHeatQueryAll, uploadHeatQuerySchedule, uploadScrapChem, uploadScrapDataInventory, uploadGradeList } from "./upload.service";

const UploadRouter = Router();
const controller = new UploadController();

UploadRouter.post(
  "/heat-query-all",
  uploadHeatQueryAll.single("file"),
  controller.uploadHeatQueryAll
);

UploadRouter.post("/grade-list", uploadGradeList.single("file"), controller.uploadGradeList);
UploadRouter.post("/scrap-data-inventory", uploadScrapDataInventory.single("file"), controller.uploadScrapDataInventory);
UploadRouter.post("/heat-query-schedule", uploadHeatQuerySchedule.single("file"), controller.uploadHeatQuerySchedule);
UploadRouter.post("/scrap-chem", uploadScrapChem.single("file"), controller.uploadScrapChem);

export default UploadRouter;