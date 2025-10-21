import {
  VisualSearchRequest,
  VisualSearchResponse,
  ImageProcessingStatus,
} from '../entities/Search'

export interface ISearchRepository {
  performVisualSearch(request: VisualSearchRequest): Promise<VisualSearchResponse>
  uploadSearchImage(image: File): Promise<string>
  getProcessingStatus(searchId: string): Promise<ImageProcessingStatus>
  getRecentSearches(userId: string, limit?: number): Promise<{ id: string; imageUrl: string; timestamp: Date }[]>
  deleteSearchHistory(userId: string): Promise<void>
}
