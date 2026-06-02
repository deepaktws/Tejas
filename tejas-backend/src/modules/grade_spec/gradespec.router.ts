import { Router } from "express";
import { GradeSpecController } from "./gradespec.controller";

const GradeSpecRouter = Router();

const controller = new GradeSpecController();

GradeSpecRouter.get("/:heatId", controller.getByHeatId);
GradeSpecRouter.get("/id/:id/next", controller.getNextHeat);

export default GradeSpecRouter;