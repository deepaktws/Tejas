import "dotenv/config";

export const config = {
  FLASK_BASE_URL: process.env.FLASK_BASE_URL ?? "http://127.0.0.1:5000",
  PORT: process.env.PORT ?? 8000,
  NODE_ENV: process.env.NODE_ENV ?? "development",
  LOG_LEVEL: process.env.LOG_LEVEL ?? "info",
};