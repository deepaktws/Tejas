import { Router } from "express";
import { PermissionController } from "./permission.controller";
import { authenticateJWT } from "../../middleware/jwt.middleware";

const permissionRouter = Router();
const permissionController = new PermissionController();

permissionRouter.use(authenticateJWT);

permissionRouter.get("/", permissionController.getPermissions);
permissionRouter.post("/", permissionController.createPermission);
permissionRouter.patch("/:id", permissionController.updatePermission);
permissionRouter.delete("/:id", permissionController.deletePermission);

export default permissionRouter;