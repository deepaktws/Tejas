import { Router } from "express";
import { UploadController } from "./upload.controller";
import { uploadHeatQueryAll,uploadScrapDataInventory } from "./upload.service";

const UploadRouter = Router();
const controller = new UploadController();

UploadRouter.post(
  "/heat-query-all",
  uploadHeatQueryAll.single("file"),
  controller.uploadHeatQueryAll
);

UploadRouter.post("/scrap-data-inventory", uploadScrapDataInventory.single("file"), controller.uploadScrapDataInventory);
export default UploadRouter;