import { Router } from "express";
import { DownloadController } from "./download.controller";
import { ROUTES } from "../../constants/route";

const DownloadRouter = Router();
const controller = new DownloadController();

DownloadRouter.get(ROUTES.DOWNLOAD_HEAT_QUERY_ALL, controller.downloadHeatQueryAll);
DownloadRouter.get(ROUTES.DOWNLOAD_GRADE_LIST, controller.downloadGradeList);
DownloadRouter.get(ROUTES.DOWNLOAD_SCRAP_DATA_INVENTORY, controller.downloadScrapDataInventory);
DownloadRouter.get(ROUTES.DOWNLOAD_HEAT_QUERY_SCHEDULE, controller.downloadHeatQuerySchedule);
DownloadRouter.get(ROUTES.DOWNLOAD_SCRAP_CHEM, controller.downloadScrapChem);
DownloadRouter.get(ROUTES.DOWNLOAD_HEAT_CHEM, controller.downloadHeatChem);

export default DownloadRouter;