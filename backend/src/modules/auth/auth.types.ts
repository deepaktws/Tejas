export interface LoginCredentials {
    userName: string;
    password: string;
}

export interface AuthUser {
    id: string;
    userName: string;
    roles: string[];
    permissions: string[];
}

export interface AccessTokenPayload {
    sub: string;
    userName: string;
    roles: string[];
    permissions: string[];
}

export interface RefreshTokenPayload {
    sub: string;
    tokenType: "refresh";
}

export interface AuthResponse {
    accessToken: string;
    refreshToken: string;
}
