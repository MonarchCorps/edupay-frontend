import axios, { type AxiosError } from 'axios'
import { API_BASE_URL } from '../utils/constants'
import type { ApiError } from '../types'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const key = localStorage.getItem('edupay_api_key')
  if (key) config.headers.Authorization = `Bearer ${key}`
  return config
})

api.interceptors.response.use(
  (res) => res,
  (err: AxiosError<{ code?: string; message?: string; details?: unknown }>) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('edupay_api_key')
      window.location.href = '/settings'
    }
    const data = err.response?.data
    const rejection: ApiError = {
      code:    data?.code    ?? 'UNKNOWN_ERROR',
      message: data?.message ?? err.message ?? 'Something went wrong. Please try again.',
      details: data?.details ?? null,
    }
    return Promise.reject(rejection)
  }
)

export default api
