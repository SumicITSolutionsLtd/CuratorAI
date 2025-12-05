import {
  VisualSearchRequest,
  VisualSearchResponse,
  ImageProcessingStatus,
  TextSearchRequest,
  TextSearchResponse,
} from '../entities/Search'

export interface ISearchRepository {
  // Visual search
  performVisualSearch(request: VisualSearchRequest): Promise<VisualSearchResponse>
  performVisualSearchByUrl(imageUrl: string): Promise<VisualSearchResponse>
  uploadSearchImage(image: File): Promise<string>
  getProcessingStatus(searchId: string): Promise<ImageProcessingStatus>
  getRecentSearches(
    userId: string,
    limit?: number
  ): Promise<{ id: string; imageUrl: string; timestamp: Date }[]>
  deleteSearchHistory(userId: string): Promise<void>

  // Text-based search
  performTextSearch(request: TextSearchRequest): Promise<TextSearchResponse>
}
