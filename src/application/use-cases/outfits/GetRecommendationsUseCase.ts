import { IOutfitRepository, PaginatedResponse } from '@domain/repositories/IOutfitRepository'
import { OutfitRecommendation, OutfitFilter } from '@domain/entities/Outfit'
import { IUserRepository } from '@domain/repositories/IUserRepository'

export class GetRecommendationsUseCase {
  constructor(
    private outfitRepository: IOutfitRepository,
    private userRepository: IUserRepository
  ) {}

  async execute(
    userId: string,
    filters?: OutfitFilter,
    page: number = 1,
    limit: number = 12
  ): Promise<PaginatedResponse<OutfitRecommendation>> {
    // Get user preferences to enhance recommendations
    const user = await this.userRepository.getUserById(userId)

    // Merge user preferences with filters
    const enhancedFilters: OutfitFilter = {
      ...filters,
      budget: filters?.budget || user.preferences.budget,
      styles: filters?.styles || user.preferences.styles,
      sizes: filters?.sizes || user.preferences.sizes,
    }

    return await this.outfitRepository.getRecommendations(
      userId,
      enhancedFilters,
      page,
      limit
    )
  }
}
