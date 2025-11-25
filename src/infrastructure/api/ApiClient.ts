import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios'

export class ApiClient {
  private client: AxiosInstance

  constructor(baseURL: string) {
    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    this.setupInterceptors()
  }

  private setupInterceptors(): void {
    // Request interceptor to add auth token
    this.client.interceptors.request.use(
      (config) => {
        // Don't add token to auth endpoints
        const isAuthEndpoint =
          config.url?.includes('/auth/login') ||
          config.url?.includes('/auth/register') ||
          config.url?.includes('/auth/oauth') ||
          config.url?.includes('/auth/refresh') ||
          config.url?.includes('/auth/password-reset') ||
          config.url?.includes('/auth/verify-email')

        if (!isAuthEndpoint) {
          const token = localStorage.getItem('curatorai_access_token')
          if (token) {
            config.headers.Authorization = `Bearer ${token}`
          }
        }
        return config
      },
      (error) => Promise.reject(error)
    )

    // Response interceptor to handle errors
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any

        // Don't attempt token refresh for auth endpoints or if already retried
        const isAuthEndpoint =
          originalRequest?.url?.includes('/auth/login') ||
          originalRequest?.url?.includes('/auth/register') ||
          originalRequest?.url?.includes('/auth/oauth') ||
          originalRequest?.url?.includes('/auth/refresh')

        if (error.response?.status === 401 && !isAuthEndpoint && !originalRequest?._retry) {
          // Token expired, try to refresh
          const refreshToken = localStorage.getItem('curatorai_refresh_token')
          if (refreshToken) {
            originalRequest._retry = true
            try {
              const response = await axios.post(`${this.client.defaults.baseURL}/auth/refresh/`, {
                refresh: refreshToken,
              })
              const { access } = response.data
              localStorage.setItem('curatorai_access_token', access)

              // Retry the original request
              if (originalRequest) {
                originalRequest.headers.Authorization = `Bearer ${access}`
                return this.client.request(originalRequest)
              }
            } catch (refreshError) {
              // Refresh failed, logout user
              localStorage.removeItem('curatorai_access_token')
              localStorage.removeItem('curatorai_refresh_token')

              // Only redirect if not already on login page
              if (!window.location.pathname.includes('/login')) {
                window.location.href = '/login'
              }
            }
          } else {
            // No refresh token, clear everything and redirect if needed
            localStorage.removeItem('curatorai_access_token')
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login'
            }
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
