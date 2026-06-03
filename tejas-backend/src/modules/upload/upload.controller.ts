import { Request, Response } from "express";

export class UploadController {
  uploadHeatQueryAll = (
    req: Request & { file?: Express.Multer.File },
    res: Response
  ) => {
    return res.status(200).json({
      message: "File uploaded successfully",
      filename: req.file!.filename,
    });
  };

  uploadGradeList = (
    req: Request & { file?: Express.Multer.File },
    res: Response
  ) => {
    return res.status(200).json({
      message: "File uploaded successfully",
      filename: req.file!.filename,
    });
  };

  uploadScrapDataInventory = (
    req: Request & { file?: Express.Multer.File },
    res: Response
  ) => {
    return res.status(200).json({
      message: "File uploaded successfully",
      filename: req.file!.filename,
    });
  };

  uploadHeatQuerySchedule = (
    req: Request & { file?: Express.Multer.File },
    res: Response
  ) => {
    return res.status(200).json({
      message: "File uploaded successfully",
      filename: req.file!.filename,
    });
  };

  uploadScrapChem = (
    req: Request & { file?: Express.Multer.File },
    res: Response
  ) => {
    return res.status(200).json({
      message: "File uploaded successfully",
      filename: req.file!.filename,
    });
  };

  uploadHeatChem = (
    req: Request & { file?: Express.Multer.File },
    res: Response
  ) => {
    return res.status(200).json({
      message: "File uploaded successfully",
      filename: req.file!.filename,
    });
  };
}