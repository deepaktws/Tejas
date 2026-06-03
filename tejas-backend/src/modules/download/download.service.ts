import { UploadType } from "../../constants/types";
import { DownloadRepository } from "./download.repository";

const downloadRepository = new DownloadRepository();

export class DownloadService {
  getLatestHeatQueryAll = async () => {
    return downloadRepository.getLatestByType(UploadType.heat_query_all);
  };

  getLatestGradeList = async () => {
    return downloadRepository.getLatestByType(UploadType.grade_list);
  };

  getLatestScrapDataInventory = async () => {
    return downloadRepository.getLatestByType(UploadType.scrap_data_inventory);
  };

  getLatestHeatQuerySchedule = async () => {
    return downloadRepository.getLatestByType(UploadType.heat_query_schedule);
  };

  getLatestScrapChem = async () => {
    return downloadRepository.getLatestByType(UploadType.scrap_chem);
  };

  getLatestHeatChem = async () => {
    return downloadRepository.getLatestByType(UploadType.heat_chem);
  };
}