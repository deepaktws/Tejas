// src/constants/routes.ts

export const API_ROUTES = {
  ROOT: "/api/v1",
  HEALTH: "/health",
} as const;

export const MODEL_ROUTES = {
  ROOT: "/model",

  RUN_MODEL: "/run_model",
} as const;

export const UPLOAD_ROUTES = {
  ROOT: "/upload",

  HEAT_QUERY_ALL: "/heat-query-all",
  GRADE_LIST: "/grade-list",
  SCRAP_DATA_INVENTORY: "/scrap-data-inventory",
  HEAT_QUERY_SCHEDULE: "/heat-query-schedule",
  SCRAP_CHEM: "/scrap-chem",
} as const;