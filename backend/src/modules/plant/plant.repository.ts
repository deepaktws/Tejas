import { prisma } from "../../lib/prisma";
import { PaginationQuery } from "../../lib/pagination";
import { CreatePlantDto, UpdatePlantDto } from "./dto/plant.dto";
import { PlantItem } from "./plant.types";

export class PlantRepository {
  async findMany({ skip, limit }: PaginationQuery, name?: string, locationId?: string) {
    const where = {
      deletedAt: null,
      ...(name && { name: { contains: name, mode: "insensitive" as const } }),
      ...(locationId && {
        plantLocations: {
          some: {
            locationId,
            deletedAt: null,
                }
              }
            })
    };
    const [data, total] = await prisma.$transaction([
      prisma.plant.findMany({
        where,
        skip,
        take: limit,
        select: { id: true, name: true, description: true },
      }),
      prisma.plant.count({ where }),
    ]);
    return { data, total };
  }

  async createPlant(dto: CreatePlantDto): Promise<PlantItem> {
    const plant = await prisma.plant.create({
      data: { name: dto.name, createdBy: dto.createdBy, plantLocations: { create: dto.locationId.map((locationId) => ({ locationId })) } },
      select: { id: true, name: true, plantLocations: { select: { locationId: true } }, createdBy: true, createdAt: true },
    });
    const formattedPlant = {
      ...plant,
      locationIds: plant.plantLocations.map((pl) => pl.locationId),
    };
    return formattedPlant;
  }

  async updatePlant(id: string, dto: UpdatePlantDto): Promise<PlantItem> {
    const plant = await prisma.plant.update({
      where: { id },
      data: { name: dto.name, updatedBy: dto.updatedBy, plantLocations: { create: dto.locationId.map((locationId) => ({ locationId })) } },
      select: { id: true, name: true, plantLocations: { select: { locationId: true } }, updatedBy: true, updatedAt: true, createdAt: true },
    });
    const formattedPlant = {
      ...plant,
      locationIds: plant.plantLocations.map((pl) => pl.locationId),
    };
    return formattedPlant;
  }

  async deletePlant(id: string): Promise<PlantItem> {
    const plant = await prisma.plant.delete({
      where: { id },
      select: { id: true, name: true, deletedBy: true, deletedAt: true, createdAt: true },
    });
    return plant;
  }
}