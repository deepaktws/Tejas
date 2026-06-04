import "dotenv/config";

export const config = {
  FLASK_BASE_URL: process.env.FLASK_BASE_URL ?? "http://127.0.0.1:5000",
  PORT: process.env.PORT ?? 8000,
};