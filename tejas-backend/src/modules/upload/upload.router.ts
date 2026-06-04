import { Router } from "express";
import { UploadController } from "./upload.controller";
import { upload } from "./upload.service";
import { ROUTES } from "../../constants/route";

const UploadRouter = Router();
const controller = new UploadController();

UploadRouter.use(upload.single("file"));

UploadRouter.post(ROUTES.UPLOAD_HEAT_QUERY_ALL, controller.uploadHeatQueryAll);
UploadRouter.post(ROUTES.UPLOAD_GRADE_LIST, controller.uploadGradeList);
UploadRouter.post(ROUTES.UPLOAD_SCRAP_DATA_INVENTORY, controller.uploadScrapDataInventory);
UploadRouter.post(ROUTES.UPLOAD_HEAT_QUERY_SCHEDULE, controller.uploadHeatQuerySchedule);
UploadRouter.post(ROUTES.UPLOAD_SCRAP_CHEM, controller.uploadScrapChem);
UploadRouter.post(ROUTES.UPLOAD_HEAT_CHEM, controller.uploadHeatChem);

export default UploadRouter;