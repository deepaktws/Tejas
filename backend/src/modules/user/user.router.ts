import { Router } from "express";
import { UserController } from "./user.controller";
import { authenticateJWT } from "../../middleware/jwt.middleware";

const userRouter = Router();
const userController = new UserController();

userRouter.post("/", userController.createUser)

userRouter.use(authenticateJWT);

userRouter.get("/", userController.getUsers);
userRouter.patch("/:id", userController.updateUser)
userRouter.delete("/:id", userController.deleteUser)

export default userRouter;