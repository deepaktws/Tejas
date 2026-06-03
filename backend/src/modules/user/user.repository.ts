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
            select: {
                id: true,
                userName: true,
                name: true,
                designation: true,
                contact: true,
                userRoles: { select: { role: { select: { name: true } } } },
            },
        });
    }

    async findMany({ skip, limit }: PaginationQuery) {
        const where = { deletedAt: null };
        const data = await prisma.user.findMany({
            where,
            skip,
            take: limit,
            select: {
                id: true,
                userName: true,
                name: true,
                designation: true,
                contact: true,
                userRoles: { select: { role: { select: { name: true } } } },
            },
        });
        const formattedData = data.map((user) => ({
            ...user,
            userRoles: user.userRoles.map((ur) => ur.role.name),
        }));
        const total = await prisma.user.count({ where });
        return { data: formattedData, total };
    }

    async create(dto: CreateUserDto & { passwordHash: string, createdBy?: string | null, userRoles?: string[] }) {
        const createdUser = await prisma.user.create({
            data: {
                userName: dto.userName,
                name: dto.name,
                designation: dto.designation,
                contact: dto.contact,
                passwordHash: dto.passwordHash,
                createdBy: dto.createdBy ?? null,
                userRoles: { create: dto.userRoles?.map((roleId) => ({ role: { connect: { id: roleId } } })) },
            },
            select: {
                id: true,
                userName: true,
                name: true,
                designation: true,
                contact: true,
                userRoles: { select: { role: { select: { name: true } } } },
            },
        });
        return {
            ...createdUser,
            userRoles: createdUser.userRoles.map((ur) => ur.role.name),
        };
    }

    async update(id: string, data: { name?: string; passwordHash?: string; updatedBy: string }) {
        const updatedUser = await prisma.user.update({
            where: { id },
            data,
            select: {
                id: true,
                userName: true,
                name: true,
                designation: true,
                contact: true,
                userRoles: { select: { role: { select: { name: true } } } },
            },
        });
        return {
            ...updatedUser,
            userRoles: updatedUser.userRoles.map((ur) => ur.role.name),
        };
    }

    async softDelete(id: string, deletedBy: string) {
        return prisma.user.update({
            where: { id },
            data: { deletedAt: new Date(), deletedBy },
        });
    }
}