import { Router } from "express";
import { UploadController } from "./upload.controller";
import { uploadHeatQueryAll, uploadHeatQuerySchedule, uploadScrapChem, uploadScrapDataInventory, uploadGradeList } from "./upload.service";
import { UPLOAD_ROUTES } from "../../constants/route";

const UploadRouter = Router();
const controller = new UploadController();

UploadRouter.post(
  UPLOAD_ROUTES.HEAT_QUERY_ALL,
  uploadHeatQueryAll.single("file"),
  controller.uploadHeatQueryAll
);

UploadRouter.post(UPLOAD_ROUTES.GRADE_LIST, uploadGradeList.single("file"), controller.uploadGradeList);
UploadRouter.post(UPLOAD_ROUTES.SCRAP_DATA_INVENTORY, uploadScrapDataInventory.single("file"), controller.uploadScrapDataInventory);
UploadRouter.post(UPLOAD_ROUTES.HEAT_QUERY_SCHEDULE, uploadHeatQuerySchedule.single("file"), controller.uploadHeatQuerySchedule);
UploadRouter.post(UPLOAD_ROUTES.SCRAP_CHEM, uploadScrapChem.single("file"), controller.uploadScrapChem);

export default UploadRouter;