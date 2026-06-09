import { Request, Response, NextFunction } from "express";
import { RoleService } from "./role.service";
import { parsePagination } from "../../lib/pagination";

export class RoleController {
    private roleService: RoleService;

    constructor() {
        this.roleService = new RoleService();
    }

    createRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const { name, description } = req.body;
            const result = await this.roleService.createRole({ name, description }, req.user!.id);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    };

    getRoles = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const pagination = parsePagination({ page: req.query.page, limit: req.query.limit });
            const result = await this.roleService.getRoles(pagination);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    };

    updateRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id as string;
            const { name, description } = req.body;
            const result = await this.roleService.updateRole(id, req.user!.id, { name, description });
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    };

    deleteRole = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id as string;
            const result = await this.roleService.deleteRole(id, req.user!.id);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    };
}