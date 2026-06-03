import { Router } from "express";
import { ModelController } from "./model.controller";
import { ROUTES } from "../../constants/route";

const ModelRouter = Router();
const controller = new ModelController();

ModelRouter.get(ROUTES.MODEL_RUN, controller.modelRun);

export default ModelRouter;