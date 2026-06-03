import { Request, Response, NextFunction } from "express";
import { UserService } from "./user.service";
import { parsePagination } from "../../lib/pagination";

export class UserController{
    private userService: UserService;
    constructor(){
        this.userService=new UserService();
    }
    createUser = async (req: Request, res: Response, next: NextFunction): Promise<void> =>{
        try{
            const { userName, password, name, designation, contact, userRoles } = req.body;
            const result = await this.userService.createUser(
                { userName, password, name, designation, contact, userRoles },
                req.user?.id,
            );
            res.status(result.status).json(result);
        } catch (error){
            next(error);
        }
    }

    getUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const pagination= parsePagination({ page: req.query.page, limit: req.query.limit });
            const result = await this.userService.getUsers(pagination);
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    }

    updateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id as string;
            const { name, password } = req.body;
            const result = await this.userService.updateUser(id, req.user!.id, { name, password });
            res.status(result.status).json(result);
        } catch (error) {
            next(error);
        }
    };

    deleteUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const id = req.params.id as string; 
            const result = await this.userService.deleteUser(id, req.user!.id);
            res.status(result.status).json(result);
        } catch (error) {
            next(error); 
        }
    };
}