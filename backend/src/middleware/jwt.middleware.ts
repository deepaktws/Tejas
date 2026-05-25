import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/config";
import { AuthUser, AccessTokenPayload } from "../modules/auth/auth.types";

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
