import { Router } from "express";
import { ModelController } from "./model.controller";

const ModelRouter = Router();
const controller = new ModelController();

ModelRouter.get("/run_model", controller.modelRun);

export default ModelRouter;