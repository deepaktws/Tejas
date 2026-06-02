import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { AuthUser, AccessTokenPayload } from "../modules/auth/auth.types";
import { PermissionName } from "../constants/constants";

// Merges the Express Request interface with our custom 'user' property globally
declare module "express-serve-static-core" {
    interface Request {
        user?: AuthUser;
    }
}

export function authenticateJWT(req: Request, res: Response, next: NextFunction): void {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        res.status(401).json({
            statusCode: 401,
            message: "Unauthorized - Token missing",
        });
        return;
    }

    const token = authHeader.split(" ")[1];

    try {
        const payload = jwt.verify(token, config.JWT_SECRET) as AccessTokenPayload;

        // Attach user to Request object so other files can access it!
        req.user = {
            id: payload.sub,
            userName: payload.userName,
            roles: payload.roles,
            permissions: payload.permissions,
        };

        next(); // Valid token! Pass control to the next handler/controller.
    } catch {
        res.status(401).json({
            statusCode: 401,
            message: "Unauthorized - Invalid or expired token",
        });
        return; // immediate return, no more going forward
    }
}

export function authorize(permissions: PermissionName[]): (req: Request, res: Response, next: NextFunction) => void {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;
        if (!user) {
            res.status(401).json({
                statusCode: 401,
                message: "Unauthorized - Token missing",
            });
            return;
        }
        if (!user.permissions.some((permission: string) => permissions.includes(permission as PermissionName))) {
            res.status(403).json({
                statusCode: 403,
                message: "Forbidden - You do not have permission to access this resource",
            });
            return;
        }
        next();
    }
}
