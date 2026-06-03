import { Request, Response } from "express";
import { ModelService } from "./model.service";

const modelService = new ModelService();

export class ModelController {
  modelRun = (_req: Request, res: Response) => {
    const csv = modelService.runModel();

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="model-output.csv"'
    );

    return res.status(200).send(csv);
  };
}