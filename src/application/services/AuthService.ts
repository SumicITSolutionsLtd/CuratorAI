import { IAuthRepository, AuthTokens } from '@domain/repositories/IAuthRepository'

export class AuthService {
  private static readonly TOKEN_KEY = 'curatorai_access_token'
  private static readonly REFRESH_TOKEN_KEY = 'curatorai_refresh_token'

  constructor(private authRepository: IAuthRepository) {}

  saveTokens(tokens: AuthTokens): void {
    localStorage.setItem(AuthService.TOKEN_KEY, tokens.accessToken)
    localStorage.setItem(AuthService.REFRESH_TOKEN_KEY, tokens.refreshToken)
  }

  getAccessToken(): string | null {
    return localStorage.getItem(AuthService.TOKEN_KEY)
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(AuthService.REFRESH_TOKEN_KEY)
  }

  clearTokens(): void {
    localStorage.removeItem(AuthService.TOKEN_KEY)
    localStorage.removeItem(AuthService.REFRESH_TOKEN_KEY)
  }

  isAuthenticated(): boolean {
    return this.getAccessToken() !== null
  }

  async refreshAccessToken(): Promise<AuthTokens | null> {
    const refreshToken = this.getRefreshToken()
    if (!refreshToken) {
      return null
    }

    try {
      const tokens = await this.authRepository.refreshToken(refreshToken)
      this.saveTokens(tokens)
      return tokens
    } catch (error) {
      this.clearTokens()
      return null
    }
  }
}
