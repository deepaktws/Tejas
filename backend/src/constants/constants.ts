
export enum Role {
    SUPER_ADMIN = 'SuperAdmin',
    ADMIN = 'Admin',
    BUSINESS_USER = 'BusinessUser',
}


export const Permission = {
    USER_CREATE: 'user.create',
    USER_READ: 'user.read',
    USER_UPDATE: 'user.update',
    USER_DELETE: 'user.delete',
    ROLE_CREATE: 'role.create',
    ROLE_READ: 'role.read',
    ROLE_UPDATE: 'role.update',
    ROLE_DELETE: 'role.delete',
    PERMISSION_CREATE: 'permission.create',
    PERMISSION_READ: 'permission.read',
    PERMISSION_UPDATE: 'permission.update',
    PERMISSION_DELETE: 'permission.delete',
    SYSTEM_CONFIGURE: 'system.configure',
} as const;

export type PermissionName = (typeof Permission)[keyof typeof Permission];

export enum StatusCodes {
    SUCCESS= 200,
    CREATED= 201,
    BAD_REQUEST= 400,
    UNAUTHORIZED= 401,
    FORBIDDEN= 403,
    NOT_FOUND= 404,
    CONFLICT= 409,
    INTERNAL_SERVER_ERROR= 500,
} ;

export const StatusMessages = {
    SUCCESS: "Success",
    CREATED: "Created",
    CONTACT_ADMINISTRATOR_SUCCESSFUL: "Your request has been sent",

    INVALID_CREDENTIALS: "Invalid credentials",
    INVALID_REFRESH_TOKEN: "Invalid refresh token",
    USER_NOT_FOUND: "User not found",

    LOGIN_SUCCESSFUL: "Login successful",
    LOGOUT_SUCCESSFUL: "Logged out successfully",
    TOKENS_REFRESHED_SUCCESSFULLY: "Tokens refreshed successfully",

    USER_ALREADY_EXISTS: "User already exists",
    USER_CREATED: "User created successfully",
    USER_UPDATED: "User updated successfully",
    USER_DELETED: "User deleted successfully",
    FORBIDDEN: "Forbidden",
} 