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
}