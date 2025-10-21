import { IAuthRepository, AuthResponse } from '@domain/repositories/IAuthRepository'
import { AuthCredentials, OAuthProvider } from '@domain/entities/User'

export class LoginUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(credentials: AuthCredentials): Promise<AuthResponse> {
    return await this.authRepository.login(credentials)
  }

  async executeWithOAuth(provider: OAuthProvider): Promise<AuthResponse> {
    return await this.authRepository.loginWithOAuth(provider)
  }
}
