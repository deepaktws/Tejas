import { Request, Response, NextFunction } from "express";
import { LocationService } from "./location.service";

export class LocationController {
  private locationService: LocationService;

  constructor() {
    this.locationService = new LocationService();
  }

  getLocations = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await this.locationService.getLocations(req.query);
      res.status(result.status).json(result);
    } catch (error) {
      next(error);
    }
  };
}