import { Request, Response } from "express";

export class UploadController {
  uploadHeatQueryAll = (req: Request & { file?: Express.Multer.File }, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    return res.status(200).json({
      message: "File uploaded successfully",
      filename: req.file.filename,
    });
  };

  uploadScrapDataInventory = (req: Request & { file?: Express.Multer.File }, res: Response) => {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });
    return res.status(200).json({ message: "File uploaded successfully", filename: req.file.filename });
  };

}