import { prisma } from "../../lib/prisma";
import { PaginationQuery } from "../../lib/pagination";

export class LocationRepository {
  async findMany({ skip, limit }: PaginationQuery, name?: string) {
    const where = {
      deletedAt: null,
      ...(name && { name: { contains: name, mode: "insensitive" as const } }),
    };
    const [data, total] = await prisma.$transaction([
      prisma.location.findMany({
        where,
        skip,
        take: limit,
        select: { id: true, name: true, description: true },
      }),
      prisma.location.count({ where }),
    ]);
    return { data, total };
  }
}