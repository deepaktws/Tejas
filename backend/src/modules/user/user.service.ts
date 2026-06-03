import { UserRepository } from "./user.repository";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { hashPassword } from "../../lib/encryptDecrypt";
import { paginate, PaginatedResponse, PaginationQuery } from "../../lib/pagination";
import { successResponse, errorResponse } from "../../utils/ErrorSuccessResponse";
import { SuccessResponseType, ErrorResponseType } from "../../utils/types";
import { StatusMessages, StatusCodes } from "../../constants/constants";
import { UserItem } from "./user.types";


export class UserService {
    private userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async createUser(dto: CreateUserDto, requesterId?:string): Promise<SuccessResponseType<UserItem> | ErrorResponseType> {
        const existing = await this.userRepository.findByUsername(dto.userName);
        if (existing) {
            return errorResponse(StatusMessages.USER_ALREADY_EXISTS, StatusCodes.CONFLICT);
        }

        const passwordHash = await hashPassword(dto.password);
        const user = await this.userRepository.create({ ...dto, passwordHash, createdBy: requesterId ?? null, userRoles: dto.userRoles });

        return successResponse(StatusMessages.USER_CREATED, user as UserItem);
    }

    async getUsers(pagination: PaginationQuery): Promise<SuccessResponseType<PaginatedResponse<UserItem>>> {
        const { data, total } = await this.userRepository.findMany(pagination);
        return successResponse(StatusMessages.SUCCESS, paginate(data as UserItem[], total, pagination));
    }

    async updateUser(id: string, requesterId: string, data: UpdateUserDto): Promise<SuccessResponseType<UserItem> | ErrorResponseType> {
        const user = await this.userRepository.findById(id);
        if (!user) {
            return errorResponse(StatusMessages.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        const updateData: { name?: string; passwordHash?: string } = {};
        if (data.name) updateData.name = data.name;
        if (data.password) updateData.passwordHash = await hashPassword(data.password);

        const updated = await this.userRepository.update(id, {...updateData, updatedBy: requesterId});
        return successResponse(StatusMessages.USER_UPDATED, updated as UserItem);
    }

    async deleteUser(id: string, requesterId: string): Promise<SuccessResponseType | ErrorResponseType> {

        const user = await this.userRepository.findById(id);
        if (!user) {
            return errorResponse(StatusMessages.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        await this.userRepository.softDelete(id, requesterId);
        return successResponse(StatusMessages.USER_DELETED);
    }
}