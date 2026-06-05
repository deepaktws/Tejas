import { Request, Response } from "express";
import { UploadService } from "./upload.service";

const uploadService = new UploadService();

export class UploadController {
  uploadHeatQueryAll = async (
    req: Request & { file?: Express.Multer.File },
    res: Response
  ) => {
    const { sessionId } = req.body;
    const record = await uploadService.saveHeatQueryAll(req.file!.path, sessionId);
    return res.status(200).json({ message: "File uploaded successfully", data: record });
  };

  uploadGradeList = async (
    req: Request & { file?: Express.Multer.File },
    res: Response
  ) => {
    const { sessionId } = req.body;
    const record = await uploadService.saveGradeList(req.file!.path, sessionId);
    return res.status(200).json({ message: "File uploaded successfully", data: record });
  };

  uploadScrapDataInventory = async (
    req: Request & { file?: Express.Multer.File },
    res: Response
  ) => {
    const { sessionId } = req.body;
    const record = await uploadService.saveScrapDataInventory(req.file!.path, sessionId);
    return res.status(200).json({ message: "File uploaded successfully", data: record });
  };

  uploadHeatQuerySchedule = async (
    req: Request & { file?: Express.Multer.File },
    res: Response
  ) => {
    const { sessionId } = req.body;
    const record = await uploadService.saveHeatQuerySchedule(req.file!.path, sessionId);
    return res.status(200).json({ message: "File uploaded successfully", data: record });
  };

  uploadScrapChem = async (
    req: Request & { file?: Express.Multer.File },
    res: Response
  ) => {
    const { sessionId } = req.body;
    const record = await uploadService.saveScrapChem(req.file!.path, sessionId);
    return res.status(200).json({ message: "File uploaded successfully", data: record });
  };

  uploadHeatChem = async (
    req: Request & { file?: Express.Multer.File },
    res: Response
  ) => {
    const { sessionId } = req.body;
    const record = await uploadService.saveHeatChem(req.file!.path, sessionId);
    return res.status(200).json({ message: "File uploaded successfully", data: record });
  };
}