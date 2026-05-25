import { PlantRepository } from "./plant.repository";
import { parsePagination, paginate, PaginatedResponse } from "../../lib/pagination";
import { PlantItem } from "./plant.types";
import { SuccessResponseType } from "../../utils/types";
import { StatusMessages } from "../../constants/constants";
import { successResponse } from "../../utils/ErrorSuccessResponse";

export class PlantService {
  private plantRepository: PlantRepository;

  constructor() {
    this.plantRepository = new PlantRepository();
  }

  async getPlants(query: Record<string, any>): Promise<SuccessResponseType<PaginatedResponse<PlantItem>>> {
    const pagination = parsePagination(query);
    const { data, total } = await this.plantRepository.findMany(pagination, query.name, query.locationId);
    return successResponse(StatusMessages.SUCCESS, paginate(data as PlantItem[], total, pagination));
  }
}