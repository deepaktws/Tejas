import { prisma } from "../../lib/prisma";
import { User } from "@prisma/client";

export class AuthRepository {
    // 1. Find user by username where user is not deleted
    async findActiveUserByUsername(userName: string): Promise<User | null> {
        return prisma.user.findFirst({
            where: {
                userName,
                deletedAt: null,
            },
        });
    }

    // 2. Find a user's full set of active roles and unique permissions
    async findUserWithPermissions(id: string): Promise<{
        id: string;
        userName: string;
        roles: string[];
        permissions: string[];
    } | null> {
        const user = await prisma.user.findFirst({
            where: { id, deletedAt: null },
            select: {
                id: true,
                userName: true,
                userRoles: {
                    where: { deletedAt: null },
                    select: {
                        role: {
                            select: {
                                name: true,
                                rolePermissions: {
                                    where: { deletedAt: null },
                                    select: {
                                        permission: {
                                            select: { name: true },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!user) return null;

        // Map relationships to flat arrays
        const roles = user.userRoles.map((ur) => ur.role.name);

        // Flatten permissions and make them unique using Set
        const permissions = [
            ...new Set(
                user.userRoles.flatMap((ur) =>
                    ur.role.rolePermissions.map((rp) => rp.permission.name)
                )
            ),
        ];

        return { id: user.id, userName: user.userName, roles, permissions };
    }
}
