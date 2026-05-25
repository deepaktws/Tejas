import { prisma } from "../../lib/prisma";
import { PaginationQuery } from "../../lib/pagination";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";

export class RoleRepository {
    async findByName(name: string) {
        return prisma.role.findFirst({
            where: { name, deletedAt: null },
        });
    }

    async findById(id: string) {
        return prisma.role.findFirst({
            where: { id, deletedAt: null },
            select: { id: true, name: true, description: true },
        });
    }

    async findMany({ skip, limit }: PaginationQuery) {
        const where = { deletedAt: null };
        const [data, total] = await prisma.$transaction([
            prisma.role.findMany({
                where,
                skip,
                take: limit,
                select: { id: true, name: true, description: true },
            }),
            prisma.role.count({ where }),
        ]);
        return { data, total };
    }

    async create(data: CreateRoleDto  & { createdBy: string }) {
        return prisma.role.create({
            data,
            select: { id: true, name: true, description: true },
        });
    }

    async update(id: string, data: UpdateRoleDto & { updatedBy: string }) {
        return prisma.role.update({
            where: { id },
            data,
            select: { id: true, name: true, description: true },
        });
    }

    async softDelete(id: string, deletedBy: string) {
        return prisma.role.update({
            where: { id , deletedAt: null},
            data: { deletedAt: new Date(), deletedBy: deletedBy },
        });
    }
}