import { Request, Response } from "express";
import { GradeSpecService } from "./gradespec.service";

export class GradeSpecController {
  constructor(
    private readonly service = new GradeSpecService()
  ) {}

  getByHeatId = async (req: Request, res: Response) => {
    const heatId = Number(req.params.heatId);

    if (!Number.isInteger(heatId)) {
      return res.status(400).json({
        message: "Invalid heat id",
      });
    }

    try {
      const data = await this.service.getByHeatId(heatId);

      return res.status(200).json(data);
    } catch {
      return res.status(404).json({
        message: "Heat not found",
      });
    }
  };

  getNextHeat = async (req: Request, res: Response) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({
        message: "Invalid id",
      });
    }

    try {
      const data = await this.service.getNextHeat(id);

      return res.status(200).json(data);
    } catch {
      return res.status(404).json({
        message: "No next heat found",
      });
    }
  };
}