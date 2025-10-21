import { User, RegisterData, AuthCredentials, OAuthProvider } from '../entities/User'

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}

export interface IAuthRepository {
  register(data: RegisterData): Promise<AuthResponse>
  login(credentials: AuthCredentials): Promise<AuthResponse>
  loginWithOAuth(provider: OAuthProvider): Promise<AuthResponse>
  logout(): Promise<void>
  refreshToken(refreshToken: string): Promise<AuthTokens>
  verifyEmail(code: string): Promise<void>
  requestPasswordReset(email: string): Promise<void>
  resetPassword(token: string, newPassword: string): Promise<void>
  getCurrentUser(): Promise<User | null>
}
