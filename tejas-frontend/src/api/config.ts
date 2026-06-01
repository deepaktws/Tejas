/** Axios base URL. Defaults to `/api` (Vite dev proxy / nginx in production). */
export function getApiBaseUrl(): string {
  const base = import.meta.env.VITE_API_BASE_URL
  return base
}

export const ACCESS_TOKEN_KEY = 'accessToken'
