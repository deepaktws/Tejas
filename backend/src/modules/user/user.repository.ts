import { prisma } from "../../lib/prisma";
import { PaginationQuery } from "../../lib/pagination";
import { CreateUserDto } from "./dto/create-user.dto";

export class UserRepository {
    async findByUsername(userName: string) {
        return prisma.user.findFirst({
            where: { userName, deletedAt: null },
        });
    }

    async findById(id: string) {
        return prisma.user.findFirst({
            where: { id, deletedAt: null },
            select: { id: true, userName: true, name: true },
        });
    }

    async findMany({ skip, limit }: PaginationQuery) {
        const where = { deletedAt: null };
        const data = await prisma.user.findMany({
            where,
            skip,
            take: limit,
            select: { id: true, userName: true, name: true },
        });
        const total = await prisma.user.count({ where });
        return { data, total };
    }

    async create(dto: CreateUserDto & { passwordHash: string, createdBy?: string | null }) {
        return prisma.user.create({
            data: {
                userName: dto.userName,
                name: dto.name,
                passwordHash: dto.passwordHash,
                createdBy: dto.createdBy ?? null
            },
            select: { id: true, userName: true, name: true },
        });
    }

    async update(id: string, data: { name?: string; passwordHash?: string; updatedBy: string }) {
        return prisma.user.update({
            where: { id },
            data,
            select: { id: true, userName: true, name: true },
        });
    }

    async softDelete(id: string, deletedBy: string) {
        return prisma.user.update({
            where: { id },
            data: { deletedAt: new Date(), deletedBy },
        });
    }
}