import axios, { isAxiosError } from 'axios'
import { ACCESS_TOKEN_KEY, getApiBaseUrl } from './config'

export const apiClient = axios.create({
  baseURL: getApiBaseUrl()+'/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
})

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = isAxiosError(error)
      ? ((error.response?.data as { message?: string } | undefined)?.message ??
        error.message)
      : 'Request failed'

    return Promise.reject(new Error(message))
  },
)

export function getApiErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message
  }
  return 'Request failed'
}
