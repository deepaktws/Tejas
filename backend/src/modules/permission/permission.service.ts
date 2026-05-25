import { PermissionRepository } from "./permission.repository";
import { CreatePermissionDto } from "./dto/create-permission.dto";
import { UpdatePermissionDto } from "./dto/update-permission.dto";
import { paginate, PaginatedResponse, PaginationQuery } from "../../lib/pagination";
import { successResponse, errorResponse } from "../../utils/ErrorSuccessResponse";
import { SuccessResponseType, ErrorResponseType } from "../../utils/types";
import { StatusMessages, StatusCodes } from "../../constants/constants";
import { PermissionItem } from "./permission.types";

export class PermissionService {
    private permissionRepository: PermissionRepository;

    constructor() {
        this.permissionRepository = new PermissionRepository();
    }

    async createPermission(data: CreatePermissionDto, requesterId: string): Promise<SuccessResponseType<PermissionItem> | ErrorResponseType> {
        const existing = await this.permissionRepository.findByName(data.name);
        if (existing) {
            return errorResponse(StatusMessages.PERMISSION_ALREADY_EXISTS, StatusCodes.CONFLICT);
        }

        const permission = await this.permissionRepository.create({ ...data, createdBy: requesterId });
        return successResponse(StatusMessages.PERMISSION_CREATED, permission as PermissionItem);
    }

    async getPermissions(pagination: PaginationQuery): Promise<SuccessResponseType<PaginatedResponse<PermissionItem>>> {
        const { data, total } = await this.permissionRepository.findMany(pagination);
        return successResponse(StatusMessages.SUCCESS, paginate(data as PermissionItem[], total, pagination));
    }

    async updatePermission(id: string, requesterId: string, data: UpdatePermissionDto): Promise<SuccessResponseType<PermissionItem> | ErrorResponseType> {
        const permission = await this.permissionRepository.findById(id);
        if (!permission) {
            return errorResponse(StatusMessages.PERMISSION_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        const updateData: { name?: string; description?: string } = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;

        const updated = await this.permissionRepository.update(id, {...updateData, updatedBy: requesterId});
        return successResponse(StatusMessages.PERMISSION_UPDATED, updated as PermissionItem);
    }

    async deletePermission(id: string, requesterId: string): Promise<SuccessResponseType | ErrorResponseType> {
        const permission = await this.permissionRepository.findById(id);
        if (!permission) {
            return errorResponse(StatusMessages.PERMISSION_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        await this.permissionRepository.softDelete(id, requesterId);
        return successResponse(StatusMessages.PERMISSION_DELETED);
    }
}