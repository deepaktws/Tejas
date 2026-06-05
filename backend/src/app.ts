import express from "express";
import { config } from "./config/config";
import morgan from "morgan";
import apiRouter from "./router";
import cors from "cors";

export const app = express();
app.set("port", config.PORT)
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());
app.use("/api/v1", apiRouter);

app.get("/", (req, res) => {
  res.send("API running");
});