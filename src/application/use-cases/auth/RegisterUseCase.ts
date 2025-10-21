import { IAuthRepository, AuthResponse } from '@domain/repositories/IAuthRepository'
import { RegisterData } from '@domain/entities/User'

export class RegisterUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(data: RegisterData): Promise<AuthResponse> {
    // Additional validation can be added here
    if (!data.agreeToTerms) {
      throw new Error('You must agree to the terms and conditions')
    }

    if (data.password.length < 8) {
      throw new Error('Password must be at least 8 characters long')
    }

    return await this.authRepository.register(data)
  }
}
