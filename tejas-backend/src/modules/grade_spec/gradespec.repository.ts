import { prisma } from "../../lib/prisma";

export class GradeSpecRepository {
  async findByHeatId(heatId: number) {
    return prisma.heat.findUnique({
      where: {
        heat_id: heatId,
      },
      include: {
        grade: {
          include: {
            grade_specs: {
              include: {
                element: true,
              },
            },
          },
        },
      },
    });
  }

  async findNextHeat(id: number) {
    return prisma.heat.findFirst({
      where: {
        id: {
          gt: id,
        },
        is_active: true,
      },
      orderBy: {
        id: "asc",
      },
    });
  }
}