import { Router } from "express";
import { ModelController } from "./model.controller";
import { MODEL_ROUTES } from "../../constants/route";

const ModelRouter = Router();
const controller = new ModelController();

ModelRouter.get(MODEL_ROUTES.RUN_MODEL, controller.modelRun);

export default ModelRouter;