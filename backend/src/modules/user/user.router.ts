import { Router } from "express";
import { UserController } from "./user.controller";
import { authenticateJWT, authorize } from "../../middleware/jwt.middleware";
import { Permission } from "../../constants/constants";

const userRouter = Router();
const userController = new UserController();

userRouter.use(authenticateJWT);
userRouter.post("/", authorize([Permission.USER_CREATE]), userController.createUser)
userRouter.get("/", authorize([Permission.USER_READ]), userController.getUsers);
userRouter.patch("/:id", authorize([Permission.USER_UPDATE]), userController.updateUser)
userRouter.delete("/:id", authorize([Permission.USER_DELETE]), userController.deleteUser)

export default userRouter;