import {
  IAuthRepository,
  AuthResponse,
  AuthTokens,
  StylePreferenceCompletion,
} from '@domain/repositories/IAuthRepository'
import { User, RegisterData, AuthCredentials, OAuthProvider } from '@domain/entities/User'
import { apiClient } from '../api/ApiClient'

export class AuthRepository implements IAuthRepository {
  async register(data: RegisterData): Promise<AuthResponse> {
    return await apiClient.post<AuthResponse>('/auth/register', data)
  }

  async login(credentials: AuthCredentials): Promise<AuthResponse> {
    return await apiClient.post<AuthResponse>('/auth/login', credentials)
  }

  async loginWithOAuth(provider: OAuthProvider): Promise<AuthResponse> {
    return await apiClient.post<AuthResponse>(`/auth/oauth/${provider.provider}`, {
      access_token: provider.token,
    })
  }

  async logout(): Promise<void> {
    await apiClient.post('/auth/logout')
    localStorage.removeItem('curatorai_access_token')
    localStorage.removeItem('curatorai_refresh_token')
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    return await apiClient.post<AuthTokens>('/auth/refresh', { refreshToken })
  }

  async verifyEmail(code: string): Promise<void> {
    await apiClient.post('/auth/verify-email/confirm', { code })
  }

  async requestEmailVerification(): Promise<void> {
    await apiClient.post('/auth/verify-email/request')
  }

  async requestPasswordReset(email: string): Promise<void> {
    await apiClient.post('/auth/password-reset/request', { email })
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    await apiClient.post('/auth/password-reset/confirm', { token, newPassword })
  }

  async getCurrentUser(): Promise<User | null> {
    try {
      return await apiClient.get<User>('/auth/me')
    } catch {
      return null
    }
  }

  async completeRegistration(preferences: StylePreferenceCompletion): Promise<User> {
    return await apiClient.post<User>('/auth/register/complete', preferences)
  }
}
