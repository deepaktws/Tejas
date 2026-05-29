import { Request, Response, NextFunction } from "express";
import { PermissionService } from "./permission.service";
import { parsePagination } from "../../lib/pagination";

export class PermissionController {
    private permissionService: PermissionService;

    constructor() {
        this.permissionService = new PermissionService();
    }

    createPermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, description } = req.body;
            const result = await this.permissionService.createPermission({ name, description }, req.user!.id);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    };

    getPermissions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const pagination = parsePagination({ page: req.query.page, limit: req.query.limit });
            const result = await this.permissionService.getPermissions(pagination);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    };

    updatePermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id as string;
            const { name, description } = req.body;
            const result = await this.permissionService.updatePermission(id, req.user!.id, { name, description });
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    };

    deletePermission = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id as string;
            const result = await this.permissionService.deletePermission(id, req.user!.id);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    };
}