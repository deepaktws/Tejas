import { Router } from "express";
import { PlantController } from "./plant.controller";
import { authenticateJWT } from "../../middleware/jwt.middleware";

const plantRouter = Router();
const plantController = new PlantController();

plantRouter.get("/", plantController.getPlants);

plantRouter.use(authenticateJWT);

plantRouter.post("/", plantController.createPlant);
plantRouter.patch("/:id", plantController.updatePlant);
plantRouter.delete("/:id", plantController.deletePlant);
export default plantRouter;