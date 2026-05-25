import { Router } from "express";
import { LocationController } from "./location.controller";

const locationRouter = Router();
const locationController = new LocationController();

locationRouter.get("/", locationController.getLocations);

export default locationRouter;