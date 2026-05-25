import { Router } from "express";
import { PlantController } from "./plant.controller";

const plantRouter = Router();
const plantController = new PlantController();

plantRouter.get("/", plantController.getPlants);

export default plantRouter;