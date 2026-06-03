import { PlantRepository } from "./plant.repository";
import { parsePagination, paginate, PaginatedResponse } from "../../lib/pagination";
import { PlantItem } from "./plant.types";
import { SuccessResponseType } from "../../utils/types";
import { StatusMessages } from "../../constants/constants";
import { successResponse } from "../../utils/ErrorSuccessResponse";
import { CreatePlantDto, UpdatePlantDto } from "./dto/plant.dto";
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

  async createPlant(dto: CreatePlantDto): Promise<SuccessResponseType<PlantItem>> {
    const plant = await this.plantRepository.createPlant(dto);
    return successResponse(StatusMessages.SUCCESS, plant as PlantItem);
  }
  async updatePlant(id: string, dto: UpdatePlantDto): Promise<SuccessResponseType<PlantItem>> {
    const plant = await this.plantRepository.updatePlant(id, dto);
    return successResponse(StatusMessages.SUCCESS, plant as PlantItem);
  }
  async deletePlant(id: string): Promise<SuccessResponseType<PlantItem>> {
    const plant = await this.plantRepository.deletePlant(id);
    return successResponse(StatusMessages.SUCCESS, plant as PlantItem);
  }
}