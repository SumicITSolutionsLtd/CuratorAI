import { ISearchRepository } from '@domain/repositories/ISearchRepository'
import { VisualSearchRequest, VisualSearchResponse } from '@domain/entities/Search'

export class PerformVisualSearchUseCase {
  constructor(private searchRepository: ISearchRepository) {}

  async execute(request: VisualSearchRequest): Promise<VisualSearchResponse> {
    // Validate image file
    const maxSize = 10 * 1024 * 1024 // 10MB
    if (request.image.size > maxSize) {
      throw new Error('Image size must be less than 10MB')
    }

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(request.image.type)) {
      throw new Error('Only JPG, PNG, and WebP images are supported')
    }

    // Set default values
    const searchRequest: VisualSearchRequest = {
      ...request,
      similarityThreshold: request.similarityThreshold || 0.85,
      removeDuplicates: request.removeDuplicates ?? true,
    }

    return await this.searchRepository.performVisualSearch(searchRequest)
  }
}
