// src/server.ts
import express from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import { config } from "./config";
import apiRouter from "./router";
import { logger } from "./lib/logger";
import { errorHandler } from './errors/errorHandler';

const app = express();
const PORT = config.PORT;

app.use(pinoHttp({ logger }));
app.use(cors());
app.use(express.json());

app.use("/api/v1", apiRouter);

app.use(errorHandler);
// 3. Start the Server
app.listen(PORT, () => {
  logger.info({ port: PORT }, "Server started");
});
