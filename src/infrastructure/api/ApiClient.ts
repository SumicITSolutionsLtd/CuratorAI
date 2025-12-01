import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'
import { sessionManager } from '../services/SessionManager'

// Auth endpoints that don't require token
// Note: Use specific paths to avoid matching authenticated endpoints like /auth/register/complete/
const AUTH_ENDPOINTS = [
  '/auth/login/',
  '/auth/register/', // Initial registration only, not /register/complete/
  '/auth/oauth/',
  '/auth/refresh/',
  '/auth/password-reset/',
  '/auth/verify-email/',
]

// Endpoints that require authentication even if they match AUTH_ENDPOINTS prefix
const AUTHENTICATED_AUTH_ENDPOINTS = ['/auth/register/complete/']

export class ApiClient {
  private client: AxiosInstance
  private isRefreshing = false
  private failedQueue: Array<{
    resolve: (token: string) => void
    reject: (error: Error) => void
  }> = []

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private isAuthEndpoint(url?: string): boolean {
    if (!url) return false
    // Check if it's an authenticated auth endpoint first (these need tokens)
    if (AUTHENTICATED_AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint))) {
      return false
    }
    // Check if it's a public auth endpoint (no token needed)
    return AUTH_ENDPOINTS.some((endpoint) => url.includes(endpoint))
  }

  private processQueue(error: Error | null, token: string | null = null): void {
    this.failedQueue.forEach((promise) => {
      if (error) {
        promise.reject(error)
      } else if (token) {
        promise.resolve(token)
      }
    })
    this.failedQueue = []
  }

  private setupInterceptors(): void {
    // Request interceptor - add auth token
    this.client.interceptors.request.use(
      (config) => {
        if (!this.isAuthEndpoint(config.url)) {
          const token = sessionManager.getAccessToken()
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor - handle 401 errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

        // Don't retry auth endpoints or already retried requests
        if (
          !originalRequest ||
          this.isAuthEndpoint(originalRequest.url) ||
          originalRequest._retry
        ) {
          return Promise.reject(error)
        }

        // Handle 401 Unauthorized
        if (error.response?.status === 401) {
          if (this.isRefreshing) {
            // Queue the request while refresh is in progress
            return new Promise<string>((resolve, reject) => {
              this.failedQueue.push({ resolve, reject })
            })
              .then((token) => {
                if (originalRequest.headers) {
                  originalRequest.headers.Authorization = `Bearer ${token}`
                }
                return this.client.request(originalRequest)
              })
              .catch((err) => Promise.reject(err))
          }

          originalRequest._retry = true
          this.isRefreshing = true

          try {
            // Use SessionManager to refresh token (includes circuit breaker)
            const newToken = await sessionManager.refreshAccessToken()

            this.processQueue(null, newToken)

            // Retry original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`
            }
            return this.client.request(originalRequest)
          } catch (refreshError) {
            this.processQueue(refreshError as Error, null)

            // Session expired - redirect to login
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login'
            }

            return Promise.reject(refreshError)
          } finally {
            this.isRefreshing = false
          }
        }

        return Promise.reject(error)
      }
    )
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config)
    return response.data
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config)
    return response.data
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.put<T>(url, data, config)
    return response.data
  }

  async patch<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.patch<T>(url, data, config)
    return response.data
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.delete<T>(url, config)
    return response.data
  }

  async upload<T>(
    url: string,
    formData: FormData,
    onProgress?: (progress: number) => void
  ): Promise<T> {
    const response = await this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total)
          onProgress(progress)
        }
      },
    })
    return response.data
  }
}

// Create singleton instances
export const apiClient = new ApiClient(
  import.meta.env.VITE_API_URL || 'https://curator-ai-backend.vercel.app/api/v1'
)
export const mlApiClient = new ApiClient(
  import.meta.env.VITE_ML_API_URL || 'https://curator-ai-backend.vercel.app/ml'
)
