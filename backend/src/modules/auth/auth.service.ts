import jwt from "jsonwebtoken";
import { config } from "../../config/config";
import { AuthRepository } from "./auth.repository";
import { comparePassword } from "../../lib/encryptDecrypt";
import { AuthResponse, AccessTokenPayload, RefreshTokenPayload, LoginCredentials } from "./auth.types";
import { StringValue } from "ms";
import { errorResponse, successResponse } from "../../utils/ErrorSuccessResponse";
import { ErrorResponseType, SuccessResponseType } from "../../utils/types";
import { StatusMessages, StatusCodes } from "../../constants/constants";
export class AuthService {
    private authRepository: AuthRepository;

    constructor() {
        this.authRepository = new AuthRepository();
    }

    // 1. Login 
    async login(dto: LoginCredentials): Promise<SuccessResponseType<AuthResponse> | ErrorResponseType> {
        const user = await this.authRepository.findActiveUserByUsername(dto.userName);
        if (!user) {
            return errorResponse(StatusMessages.INVALID_CREDENTIALS, StatusCodes.UNAUTHORIZED);
        }

        // Using our custom common encryption library!
        const passwordMatch = await comparePassword(dto.password, user.passwordHash);
        if (!passwordMatch) {
            return errorResponse(StatusMessages.INVALID_CREDENTIALS, StatusCodes.UNAUTHORIZED);
        }

        const userWithPermissions = await this.authRepository.findUserWithPermissions(user.id);

        const accessPayload: AccessTokenPayload = {
            sub: user.id,
            userName: user.userName,
            roles: userWithPermissions?.roles ?? [],
            permissions: userWithPermissions?.permissions ?? [],
        };

        const refreshPayload: RefreshTokenPayload = {
            sub: user.id,
            tokenType: "refresh",
        };

        // Sign the Access Token (expires in 15 minutes)
        const accessToken = jwt.sign(accessPayload, config.JWT_SECRET, {
            expiresIn: config.JWT_ACCESS_EXPIRES_IN as StringValue,
        });

        // Sign the Refresh Token (expires in 7 days)
        const refreshToken = jwt.sign(refreshPayload, config.JWT_SECRET, {
            expiresIn: config.JWT_REFRESH_EXPIRES_IN as StringValue,
        });

        return successResponse(StatusMessages.LOGIN_SUCCESSFUL, { accessToken, refreshToken });
    }

    // 2. Logout Logic (stateless)
    logout(): SuccessResponseType{
        return successResponse(StatusMessages.LOGOUT_SUCCESSFUL);
    }

    // 3. Refresh Token Logic
    async refresh(refreshToken: string): Promise<SuccessResponseType<AuthResponse> | ErrorResponseType> {
        let payload: RefreshTokenPayload;

        try {
            payload = jwt.verify(refreshToken, config.JWT_SECRET) as RefreshTokenPayload;
        } catch {
            return errorResponse(StatusMessages.INVALID_REFRESH_TOKEN, StatusCodes.UNAUTHORIZED);
        }

        if (payload.tokenType !== "refresh") {
            return errorResponse(StatusMessages.INVALID_REFRESH_TOKEN, StatusCodes.UNAUTHORIZED);
        }

        const userWithPermissions = await this.authRepository.findUserWithPermissions(payload.sub);
        if (!userWithPermissions) {
            return errorResponse(StatusMessages.USER_NOT_FOUND, StatusCodes.NOT_FOUND);
        }

        const newAccessPayload: AccessTokenPayload = {
            sub: payload.sub,
            userName: userWithPermissions.userName,
            roles: userWithPermissions.roles,
            permissions: userWithPermissions.permissions,
        };

        const newRefreshPayload: RefreshTokenPayload = {
            sub: payload.sub,
            tokenType: "refresh",
        };

        const newAccessToken = jwt.sign(newAccessPayload, config.JWT_SECRET, {
            expiresIn: config.JWT_ACCESS_EXPIRES_IN as StringValue,
        });

        const newRefreshToken = jwt.sign(newRefreshPayload, config.JWT_SECRET, {
            expiresIn: config.JWT_REFRESH_EXPIRES_IN as StringValue,
        });

        return successResponse(StatusMessages.TOKENS_REFRESHED_SUCCESSFULLY, { accessToken: newAccessToken, refreshToken: newRefreshToken });
    }
}
