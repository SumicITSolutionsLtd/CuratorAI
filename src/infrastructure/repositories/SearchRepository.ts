import { ISearchRepository } from '@domain/repositories/ISearchRepository'
import {
  VisualSearchRequest,
  VisualSearchResponse,
  ImageProcessingStatus,
} from '@domain/entities/Search'
import { mlApiClient } from '../api/ApiClient'

export class SearchRepository implements ISearchRepository {
  async performVisualSearch(request: VisualSearchRequest): Promise<VisualSearchResponse> {
    const formData = new FormData()
    formData.append('image', request.image)
    if (request.similarityThreshold) {
      formData.append('similarityThreshold', request.similarityThreshold.toString())
    }
    if (request.removeDuplicates !== undefined) {
      formData.append('removeDuplicates', request.removeDuplicates.toString())
    }
    if (request.filters) {
      formData.append('filters', JSON.stringify(request.filters))
    }

    return await mlApiClient.upload<VisualSearchResponse>('/search/visual', formData)
  }

  async uploadSearchImage(image: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', image)
    const response = await mlApiClient.upload<{ imageUrl: string }>('/search/upload', formData)
    return response.imageUrl
  }

  async getProcessingStatus(searchId: string): Promise<ImageProcessingStatus> {
    return await mlApiClient.get<ImageProcessingStatus>(`/search/status/${searchId}`)
  }

  async getRecentSearches(
    userId: string,
    limit: number = 10
  ): Promise<{ id: string; imageUrl: string; timestamp: Date }[]> {
    return await mlApiClient.get<{ id: string; imageUrl: string; timestamp: Date }[]>(
      `/search/recent/${userId}?limit=${limit}`
    )
  }

  async deleteSearchHistory(userId: string): Promise<void> {
    await mlApiClient.delete(`/search/history/${userId}`)
  }
}
