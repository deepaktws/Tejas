import { Request, Response } from "express";
import { DownloadService } from "./download.service";
import path from "path";
import fs from "fs";

const downloadService = new DownloadService();

/**
 * Convert file extension → MIME type
 */
const getMimeType = (filepath: string) => {
  const ext = path.extname(filepath).toLowerCase();

  switch (ext) {
    case ".csv":
      return "text/csv";
    case ".xlsx":
      return "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    case ".pdf":
      return "application/pdf";
    case ".json":
      return "application/json";
    case ".txt":
      return "text/plain";
    default:
      return "application/octet-stream";
  }
};

/**
 * Read file and return base64 JSON response
 */
const sendFileAsBase64 = (res: Response, filepath: string) => {
  const absPath = path.resolve(filepath);

  if (!fs.existsSync(absPath)) {
    return res.status(404).json({ message: "File not found on disk" });
  }

  try {
    const fileBuffer = fs.readFileSync(absPath);
    const base64 = fileBuffer.toString("base64");

    return res.json({
      filename: path.basename(absPath),
      mimeType: getMimeType(absPath),
      size: fileBuffer.length,
      data: base64,
    });
  } catch (err) {
    console.error("File read error:", err);
    return res.status(500).json({ message: "Failed to read file" });
  }
};

export class DownloadController {
  downloadHeatQueryAll = async (_req: Request, res: Response) => {
    const record = await downloadService.getLatestHeatQueryAll();
    if (!record) return res.status(404).json({ message: "No file found" });
    return sendFileAsBase64(res, record.filepath);
  };

  downloadGradeList = async (_req: Request, res: Response) => {
    const record = await downloadService.getLatestGradeList();
    if (!record) return res.status(404).json({ message: "No file found" });
    return sendFileAsBase64(res, record.filepath);
  };

  downloadScrapDataInventory = async (_req: Request, res: Response) => {
    const record = await downloadService.getLatestScrapDataInventory();
    if (!record) return res.status(404).json({ message: "No file found" });
    return sendFileAsBase64(res, record.filepath);
  };

  downloadHeatQuerySchedule = async (_req: Request, res: Response) => {
    const record = await downloadService.getLatestHeatQuerySchedule();
    if (!record) return res.status(404).json({ message: "No file found" });
    return sendFileAsBase64(res, record.filepath);
  };

  downloadScrapChem = async (_req: Request, res: Response) => {
    const record = await downloadService.getLatestScrapChem();
    if (!record) return res.status(404).json({ message: "No file found" });
    return sendFileAsBase64(res, record.filepath);
  };

  downloadHeatChem = async (_req: Request, res: Response) => {
    const record = await downloadService.getLatestHeatChem();
    if (!record) return res.status(404).json({ message: "No file found" });
    return sendFileAsBase64(res, record.filepath);
  };
}