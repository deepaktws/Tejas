import { Router } from "express";
import { RoleController } from "./role.controller";
import { authenticateJWT } from "../../middleware/jwt.middleware";

const roleRouter = Router();
const roleController = new RoleController();

roleRouter.use(authenticateJWT);

roleRouter.get("/", roleController.getRoles);
roleRouter.post("/", roleController.createRole);
roleRouter.patch("/:id", roleController.updateRole);
roleRouter.delete("/:id", roleController.deleteRole);

export default roleRouter;