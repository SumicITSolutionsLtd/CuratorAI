import { describe, it, expect, beforeEach, vi } from 'vitest'
import { AuthRepository } from './AuthRepository'
import { apiClient } from '../api/ApiClient'
import type { AuthResponse, AuthTokens, StylePreferenceCompletion } from '@domain/repositories/IAuthRepository'
import type { RegisterData, AuthCredentials, OAuthProvider, User } from '@domain/entities/User'

// Mock the ApiClient
vi.mock('../api/ApiClient', () => ({
  apiClient: {
    post: vi.fn(),
    get: vi.fn(),
  },
}))

describe('AuthRepository', () => {
  let authRepository: AuthRepository
  let mockLocalStorage: { [key: string]: string }

  beforeEach(() => {
    authRepository = new AuthRepository()
    mockLocalStorage = {}

    // Mock localStorage
    globalThis.localStorage = {
      getItem: vi.fn((key: string) => mockLocalStorage[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockLocalStorage[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete mockLocalStorage[key]
      }),
      clear: vi.fn(() => {
        mockLocalStorage = {}
      }),
      length: 0,
      key: vi.fn(),
    }

    vi.clearAllMocks()
  })

  describe('register', () => {
    it('should successfully register a new user', async () => {
      const registerData: RegisterData = {
        email: 'test@example.com',
        password: 'password123',
        firstName: 'Test',
        lastName: 'User',
      }

      const mockResponse: AuthResponse = {
        user: {
          id: 1,
          email: 'test@example.com',
          username: 'testuser',
        } as unknown as User,
        tokens: {
          accessToken: 'access_token',
          refreshToken: 'refresh_token',
          expiresIn: 3600,
        },
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const result = await authRepository.register(registerData)

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register', registerData)
      expect(result).toEqual(mockResponse)
    })

    it('should throw error when registration fails', async () => {
      const registerData: RegisterData = {
        email: 'test@example.com',
        password: 'password123',
        username: 'testuser',
      }

      const mockError = new Error('Registration failed')
      vi.mocked(apiClient.post).mockRejectedValue(mockError)

      await expect(authRepository.register(registerData)).rejects.toThrow('Registration failed')
    })
  })

  describe('login', () => {
    it('should successfully login with credentials', async () => {
      const credentials: AuthCredentials = {
        email: 'test@example.com',
        password: 'password123',
      }

      const mockResponse: AuthResponse = {
        user: {
          id: 1,
          email: 'test@example.com',
          username: 'testuser',
        } as unknown as User,
        tokens: {
          accessToken: 'access_token',
          refreshToken: 'refresh_token',
          expiresIn: 3600,
        },
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const result = await authRepository.login(credentials)

      expect(apiClient.post).toHaveBeenCalledWith('/auth/login', credentials)
      expect(result).toEqual(mockResponse)
    })

    it('should throw error when login fails', async () => {
      const credentials: AuthCredentials = {
        email: 'test@example.com',
        password: 'wrongpassword',
      }

      const mockError = new Error('Invalid credentials')
      vi.mocked(apiClient.post).mockRejectedValue(mockError)

      await expect(authRepository.login(credentials)).rejects.toThrow('Invalid credentials')
    })
  })

  describe('loginWithOAuth', () => {
    it('should successfully login with Google OAuth', async () => {
      const oauthProvider: OAuthProvider = {
        provider: 'google',
        token: 'google_oauth_token',
      }

      const mockResponse: AuthResponse = {
        user: {
          id: 1,
          email: 'test@example.com',
          username: 'testuser',
        } as unknown as User,
        tokens: {
          accessToken: 'access_token',
          refreshToken: 'refresh_token',
          expiresIn: 3600,
        },
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const result = await authRepository.loginWithOAuth(oauthProvider)

      expect(apiClient.post).toHaveBeenCalledWith('/auth/oauth/google', {
        access_token: 'google_oauth_token',
      })
      expect(result).toEqual(mockResponse)
    })

    it('should successfully login with Facebook OAuth', async () => {
      const oauthProvider: OAuthProvider = {
        provider: 'facebook',
        token: 'facebook_oauth_token',
      }

      const mockResponse: AuthResponse = {
        user: {
          id: 1,
          email: 'test@example.com',
          username: 'testuser',
        } as unknown as User,
        tokens: {
          accessToken: 'access_token',
          refreshToken: 'refresh_token',
          expiresIn: 3600,
        },
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const result = await authRepository.loginWithOAuth(oauthProvider)

      expect(apiClient.post).toHaveBeenCalledWith('/auth/oauth/facebook', {
        access_token: 'facebook_oauth_token',
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('logout', () => {
    it('should successfully logout and clear tokens', async () => {
      mockLocalStorage['curatorai_access_token'] = 'access_token'
      mockLocalStorage['curatorai_refresh_token'] = 'refresh_token'

      vi.mocked(apiClient.post).mockResolvedValue(undefined)

      await authRepository.logout()

      expect(apiClient.post).toHaveBeenCalledWith('/auth/logout')
      expect(localStorage.removeItem).toHaveBeenCalledWith('curatorai_access_token')
      expect(localStorage.removeItem).toHaveBeenCalledWith('curatorai_refresh_token')
    })
  })

  describe('refreshToken', () => {
    it('should successfully refresh access token', async () => {
      const refreshToken = 'refresh_token'
      const mockTokens: AuthTokens = {
        accessToken: 'new_access_token',
        refreshToken: 'new_refresh_token',
        expiresIn: 3600,
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockTokens)

      const result = await authRepository.refreshToken(refreshToken)

      expect(apiClient.post).toHaveBeenCalledWith('/auth/refresh', { refreshToken })
      expect(result).toEqual(mockTokens)
    })

    it('should throw error when token refresh fails', async () => {
      const refreshToken = 'invalid_refresh_token'
      const mockError = new Error('Invalid refresh token')

      vi.mocked(apiClient.post).mockRejectedValue(mockError)

      await expect(authRepository.refreshToken(refreshToken)).rejects.toThrow('Invalid refresh token')
    })
  })

  describe('verifyEmail', () => {
    it('should successfully verify email with code', async () => {
      const code = '123456'
      vi.mocked(apiClient.post).mockResolvedValue(undefined)

      await authRepository.verifyEmail(code)

      expect(apiClient.post).toHaveBeenCalledWith('/auth/verify-email/confirm', { code })
    })
  })

  describe('requestEmailVerification', () => {
    it('should successfully request email verification', async () => {
      vi.mocked(apiClient.post).mockResolvedValue(undefined)

      await authRepository.requestEmailVerification()

      expect(apiClient.post).toHaveBeenCalledWith('/auth/verify-email/request')
    })
  })

  describe('requestPasswordReset', () => {
    it('should successfully request password reset', async () => {
      const email = 'test@example.com'
      vi.mocked(apiClient.post).mockResolvedValue(undefined)

      await authRepository.requestPasswordReset(email)

      expect(apiClient.post).toHaveBeenCalledWith('/auth/password-reset/request', { email })
    })
  })

  describe('resetPassword', () => {
    it('should successfully reset password', async () => {
      const token = 'reset_token'
      const newPassword = 'newpassword123'
      vi.mocked(apiClient.post).mockResolvedValue(undefined)

      await authRepository.resetPassword(token, newPassword)

      expect(apiClient.post).toHaveBeenCalledWith('/auth/password-reset/confirm', {
        token,
        newPassword,
      })
    })
  })

  describe('getCurrentUser', () => {
    it('should successfully get current user', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
      } as unknown as User

      vi.mocked(apiClient.get).mockResolvedValue(mockUser)

      const result = await authRepository.getCurrentUser()

      expect(apiClient.get).toHaveBeenCalledWith('/auth/me')
      expect(result).toEqual(mockUser)
    })

    it('should return null when user is not authenticated', async () => {
      vi.mocked(apiClient.get).mockRejectedValue(new Error('Unauthorized'))

      const result = await authRepository.getCurrentUser()

      expect(result).toBeNull()
    })
  })

  describe('completeRegistration', () => {
    it('should successfully complete registration with preferences', async () => {
      const preferences: StylePreferenceCompletion = {
        shop_for: 'women',
        styles: ['casual', 'formal'],
        dress_for: ['work', 'casual'],
        budget_range: 'medium',
      }

      const mockUser = {
        id: 1,
        email: 'test@example.com',
        username: 'testuser',
      } as unknown as User

      vi.mocked(apiClient.post).mockResolvedValue(mockUser)

      const result = await authRepository.completeRegistration(preferences)

      expect(apiClient.post).toHaveBeenCalledWith('/auth/register/complete', preferences)
      expect(result).toEqual(mockUser)
    })
  })
})
