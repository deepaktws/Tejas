import { ModelRepository } from "./model.repository";
import { sendToPlanner } from "../../lib/kalamClient";

const modelRepository = new ModelRepository();

export class ModelService {
  runModel = async (
    scrapChemId: number,
    heatQueryScheduleId: number,
    scrapInventoryId: number,
    gradeFileId?: number
  ) => {
    const ids = [scrapChemId, heatQueryScheduleId, scrapInventoryId, ...(gradeFileId ? [gradeFileId] : [])];
    const files = await modelRepository.getFilesByIds(ids);

    const kfFile = files.find(f => f.id === scrapChemId);
    const heatQuerySchedule = files.find(f => f.id === heatQueryScheduleId);
    const scrapInventory = files.find(f => f.id === scrapInventoryId);
    const gradeFile = gradeFileId ? files.find(f => f.id === gradeFileId) : undefined;

    if (!kfFile) throw new Error(`KF file record not found: ${scrapChemId}`);
    if (!heatQuerySchedule) throw new Error(`HeatQuerySchedule record not found: ${heatQueryScheduleId}`);
    if (!scrapInventory) throw new Error(`ScrapInventory record not found: ${scrapInventoryId}`);

    return await sendToPlanner(
      kfFile.filepath,
      heatQuerySchedule.filepath,
      scrapInventory.filepath,
      gradeFile?.filepath,
    );
  };
}