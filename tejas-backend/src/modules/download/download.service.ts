import { FileType } from "../../constants/types";
import { DownloadRepository } from "./download.repository";

const downloadRepository = new DownloadRepository();

export class DownloadService {
  getLatestHeatQueryAll = async () => {
    return downloadRepository.getLatestByType(FileType.heat_query_all);
  };

  getLatestGradeList = async () => {
    return downloadRepository.getLatestByType(FileType.grade_list);
  };

  getLatestScrapDataInventory = async () => {
    return downloadRepository.getLatestByType(FileType.scrap_data_inventory);
  };

  getLatestHeatQuerySchedule = async () => {
    return downloadRepository.getLatestByType(FileType.heat_query_schedule);
  };

  getLatestScrapChem = async () => {
    return downloadRepository.getLatestByType(FileType.scrap_chem);
  };

  getLatestHeatChem = async () => {
    return downloadRepository.getLatestByType(FileType.heat_chem);
  };
}