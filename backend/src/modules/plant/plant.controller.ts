import { Request, Response, NextFunction } from "express";
import { PlantService } from "./plant.service";

export class PlantController {
  private plantService: PlantService;

  constructor() {
    this.plantService = new PlantService();
  }

  getPlants = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.plantService.getPlants(req.query);
      res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  };

  createPlant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { name, locationId} = req.body;
      const result = await this.plantService.createPlant({ name, locationId, createdBy: req.user!.id as string });
      res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  };

  updatePlant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { name, locationId } = req.body;
      const result = await this.plantService.updatePlant(id as string, { name, locationId, updatedBy: req.user!.id as string });
      res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  };

  deletePlant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const result = await this.plantService.deletePlant(id as string);
      res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  };
}