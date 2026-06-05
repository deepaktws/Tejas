import express from "express";
import authRouter from "./modules/auth/auth.router";
import plantRouter from "./modules/plant/plant.router";
import locationRouter from "./modules/location/location.router";
import userRouter from "./modules/user/user.router";

const apiRouter = express.Router();

apiRouter.use("/auth", authRouter);
apiRouter.use("/plants", plantRouter);
apiRouter.use("/locations", locationRouter);
apiRouter.use("/users", userRouter);

export default apiRouter;