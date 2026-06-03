import { Router } from "express";
import { UploadController } from "./upload.controller";
import { uploadHeatQueryAll, uploadHeatQuerySchedule, uploadScrapChem, uploadScrapDataInventory, uploadGradeList } from "./upload.service";
import { ROUTES } from "../../constants/route";

const UploadRouter = Router();
const controller = new UploadController();

UploadRouter.post(
  ROUTES.UPLOAD_HEAT_QUERY_ALL,
  uploadHeatQueryAll.single("file"),
  controller.uploadHeatQueryAll
);

UploadRouter.post(ROUTES.UPLOAD_GRADE_LIST, uploadGradeList.single("file"), controller.uploadGradeList);
UploadRouter.post(ROUTES.UPLOAD_SCRAP_DATA_INVENTORY, uploadScrapDataInventory.single("file"), controller.uploadScrapDataInventory);
UploadRouter.post(ROUTES.UPLOAD_HEAT_QUERY_SCHEDULE, uploadHeatQuerySchedule.single("file"), controller.uploadHeatQuerySchedule);
UploadRouter.post(ROUTES.UPLOAD_SCRAP_CHEM, uploadScrapChem.single("file"), controller.uploadScrapChem);
UploadRouter.post(ROUTES.UPLOAD_HEAT_CHEM, uploadScrapChem.single("file"), controller.uploadHeatChem);

export default UploadRouter;