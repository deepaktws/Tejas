// src/server.ts
import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { config } from "./config";
import apiRouter from "./router";
import { logger } from "./lib/logger";

const app = express();
const PORT = config.PORT;

app.use(pinoHttp({ logger }));
app.use(cors());
app.use(express.json());

app.use("/api/v1", apiRouter);

app.listen(PORT, () => {
  logger.info({ port: PORT }, "Server started");
});
