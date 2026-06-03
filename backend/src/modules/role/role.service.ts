import { RoleRepository } from "./role.repository";
import { CreateRoleDto } from "./dto/create-role.dto";
import { UpdateRoleDto } from "./dto/update-role.dto";
import { paginate, PaginatedResponse, PaginationQuery } from "../../lib/pagination";
import { successResponse, errorResponse } from "../../utils/ErrorSuccessResponse";
import { SuccessResponseType, ErrorResponseType } from "../../utils/types";
import { StatusMessages, StatusCodes } from "../../constants/constants";
import { RoleItem } from "./role.types";

export class RoleService {
    private roleRepository: RoleRepository;

    constructor() {
        this.roleRepository = new RoleRepository();
    }

    async createRole(data: CreateRoleDto, requesterId: string): Promise<SuccessResponseType<RoleItem> | ErrorResponseType> {
        const existing = await this.roleRepository.findByName(data.name);
        if (existing) {
            return errorResponse(StatusMessages.ROLE_ALREADY_EXISTS, StatusCodes.CONFLICT);
        }

        const role = await this.roleRepository.create({ ...data, createdBy: requesterId });
        return successResponse(StatusMessages.ROLE_CREATED, role as RoleItem);
    }

    async getRoles(pagination: PaginationQuery): Promise<SuccessResponseType<PaginatedResponse<RoleItem>>> {
        const { data, total } = await this.roleRepository.findMany(pagination);
        return successResponse(StatusMessages.SUCCESS, paginate(data as RoleItem[], total, pagination));
    }

    async updateRole(id: string, requesterId: string, data: UpdateRoleDto): Promise<SuccessResponseType<RoleItem> | ErrorResponseType> {
        const role = await this.roleRepository.findById(id);
        if (!role) {
            return errorResponse(StatusMessages.ROLE_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        const updateData: { name?: string; description?: string } = {};
        if (data.name !== undefined) updateData.name = data.name;
        if (data.description !== undefined) updateData.description = data.description;

        const updated = await this.roleRepository.update(id,  { ...updateData, updatedBy: requesterId });
        return successResponse(StatusMessages.ROLE_UPDATED, updated as RoleItem);
    }

    async deleteRole(id: string, requesterId: string): Promise<SuccessResponseType | ErrorResponseType> {
        const role = await this.roleRepository.findById(id);
        if (!role) {
            return errorResponse(StatusMessages.ROLE_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        await this.roleRepository.softDelete(id, requesterId);
        return successResponse(StatusMessages.ROLE_DELETED);
    }
}