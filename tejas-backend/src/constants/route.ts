// src/constants/routes.ts

export const ROUTES = {
  API_ROOT: "/api/v1",
  API_HEALTH: "/health",

  MODEL_ROOT: "/model",
  MODEL_RUN: "/run_model",

  UPLOAD_ROOT: "/upload",
  UPLOAD_HEAT_QUERY_ALL: "/heat-query-all",
  UPLOAD_GRADE_LIST: "/grade-list",
  UPLOAD_SCRAP_DATA_INVENTORY: "/scrap-data-inventory",
  UPLOAD_HEAT_QUERY_SCHEDULE: "/heat-query-schedule",
  UPLOAD_SCRAP_CHEM: "/scrap-chem",
  UPLOAD_HEAT_CHEM: "/heat-chem"
} as const;