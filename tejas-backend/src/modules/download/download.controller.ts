import { Request, Response } from "express";
import { DownloadService } from "./download.service";
import path from "path";
import fs from "fs";

const downloadService = new DownloadService();

const sendFile = (res: Response, filepath: string) => {
  const absPath = path.resolve(filepath);

  if (!fs.existsSync(absPath)) {
    return res.status(404).json({ message: "File not found on disk" });
  }

  return res.download(absPath, path.basename(absPath));
};

export class DownloadController {
  downloadHeatQueryAll = async (_req: Request, res: Response) => {
    const record = await downloadService.getLatestHeatQueryAll();
    if (!record) return res.status(404).json({ message: "No file found" });
    return sendFile(res, record.filepath);
  };

  downloadGradeList = async (_req: Request, res: Response) => {
    const record = await downloadService.getLatestGradeList();
    if (!record) return res.status(404).json({ message: "No file found" });
    return sendFile(res, record.filepath);
  };

  downloadScrapDataInventory = async (_req: Request, res: Response) => {
    const record = await downloadService.getLatestScrapDataInventory();
    if (!record) return res.status(404).json({ message: "No file found" });
    return sendFile(res, record.filepath);
  };

  downloadHeatQuerySchedule = async (_req: Request, res: Response) => {
    const record = await downloadService.getLatestHeatQuerySchedule();
    if (!record) return res.status(404).json({ message: "No file found" });
    return sendFile(res, record.filepath);
  };

  downloadScrapChem = async (_req: Request, res: Response) => {
    const record = await downloadService.getLatestScrapChem();
    if (!record) return res.status(404).json({ message: "No file found" });
    return sendFile(res, record.filepath);
  };

  downloadHeatChem = async (_req: Request, res: Response) => {
    const record = await downloadService.getLatestHeatChem();
    if (!record) return res.status(404).json({ message: "No file found" });
    return sendFile(res, record.filepath);
  };
}