import { prisma } from "../../lib/prisma";
import { PaginationQuery } from "../../lib/pagination";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";

export class PermissionRepository {
    async findByName(name: string) {
        return prisma.permission.findFirst({
            where: { name, deletedAt: null },
        });
    }

    async findById(id: string) {
        return prisma.permission.findFirst({
            where: { id, deletedAt: null },
            select: { id: true, name: true, description: true },
        });
    }

    async findMany({ skip, limit }: PaginationQuery) {
        const where = { deletedAt: null };
        const [data, total] = await prisma.$transaction([
            prisma.permission.findMany({
                where,
                skip,
                take: limit,
                select: { id: true, name: true, description: true },
            }),
            prisma.permission.count({ where }),
        ]);
        return { data, total };
    }

    async create(data: CreatePermissionDto  & { createdBy: string }) {
        return prisma.permission.create({
            data,
            select: { id: true, name: true, description: true },
        });
    }

    async update(id: string, data: UpdatePermissionDto & { updatedBy: string }) {
        return prisma.permission.update({
            where: { id },
            data,
            select: { id: true, name: true, description: true },
        });
    }

    async softDelete(id: string, deletedBy: string) {
        return prisma.permission.update({
            where: { id, deletedAt:null },
            data: { deletedAt: new Date() },
        });
    }
}