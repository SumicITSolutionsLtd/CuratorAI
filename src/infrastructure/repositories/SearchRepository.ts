import { ISearchRepository } from '@domain/repositories/ISearchRepository'
import {
  VisualSearchRequest,
  VisualSearchResponse,
  VisualSearchResult,
  ImageProcessingStatus,
  TextSearchRequest,
  TextSearchResponse,
  TextSearchOutfitResult,
  TextSearchUserResult,
} from '@domain/entities/Search'
import { apiClient, mlApiClient } from '../api/ApiClient'

// Backend response types
interface BackendSearchResult {
  id: string | number
  similarity_score?: number
  similarityScore?: number
  outfit?: {
    id: string | number
    title?: string
    name?: string
    main_image?: string
    imageUrl?: string
    items?: Array<{
      id: string | number
      name?: string
      price?: number | string
      brand?: string
      image_url?: string
    }>
    total_price?: number | string
    totalPrice?: number | string
  }
  product?: {
    id: string | number
    name?: string
    price?: number | string
    brand?: string
    image_url?: string
    imageUrl?: string
  }
}

interface BackendVisualSearchResponse {
  success?: boolean
  data?: {
    results?: BackendSearchResult[]
    search_id?: string
    detected_items?: number
    detected_style?: string
  }
  results?: BackendSearchResult[]
  search_id?: string
}

// Transform backend response to frontend format
function transformSearchResults(backendResults: BackendSearchResult[]): VisualSearchResult[] {
  return backendResults.map((result) => ({
    id: String(result.id),
    similarityScore: result.similarity_score || result.similarityScore || 0,
    outfit: result.outfit
      ? {
          id: String(result.outfit.id),
          name: result.outfit.title || result.outfit.name || 'Unknown',
          imageUrl: result.outfit.main_image || result.outfit.imageUrl || '',
          items:
            result.outfit.items?.map((item) => ({
              id: String(item.id),
              name: item.name || '',
              price: parseFloat(String(item.price || 0)),
              brand: item.brand || '',
              imageUrl: item.image_url || '',
            })) || [],
          totalPrice: parseFloat(
            String(result.outfit.total_price || result.outfit.totalPrice || 0)
          ),
        }
      : undefined,
    product: result.product
      ? {
          id: String(result.product.id),
          name: result.product.name || '',
          price: parseFloat(String(result.product.price || 0)),
          brand: result.product.brand || '',
          imageUrl: result.product.image_url || result.product.imageUrl || '',
        }
      : undefined,
  }))
}

export class SearchRepository implements ISearchRepository {
  // Visual search by uploading an image file
  async performVisualSearch(request: VisualSearchRequest): Promise<VisualSearchResponse> {
    const formData = new FormData()
    formData.append('image', request.image)

    if (request.similarityThreshold) {
      formData.append('similarity_threshold', request.similarityThreshold.toString())
    }
    if (request.removeDuplicates !== undefined) {
      formData.append('remove_duplicates', request.removeDuplicates.toString())
    }
    if (request.filters) {
      formData.append('filters', JSON.stringify(request.filters))
    }

    const response = await apiClient.upload<BackendVisualSearchResponse>(
      '/search/visual/',
      formData
    )

    // Extract results from response (handles both { success, data } and direct response)
    const data = response.data || response
    const results = data.results || []

    return {
      results: transformSearchResults(results),
      searchId: data.search_id || response.search_id,
    }
  }

  // Visual search by providing an image URL
  async performVisualSearchByUrl(imageUrl: string): Promise<VisualSearchResponse> {
    const response = await apiClient.post<BackendVisualSearchResponse>('/search/visual/url/', {
      image_url: imageUrl,
    })

    const data = response.data || response
    const results = data.results || []

    return {
      results: transformSearchResults(results),
      searchId: data.search_id || response.search_id,
    }
  }

  // Upload image and get URL back (for preview)
  async uploadSearchImage(image: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', image)

    // Try main API first, fallback to ML API
    try {
      await apiClient.upload<{
        success?: boolean
        data?: { image_url?: string; imageUrl?: string }
        image_url?: string
        imageUrl?: string
      }>('/search/visual/', formData)

      // Create a local URL for preview (the actual search happens in performVisualSearch)
      return URL.createObjectURL(image)
    } catch {
      // Fallback to ML API if main API doesn't support upload
      try {
        const response = await mlApiClient.upload<{ imageUrl: string; image_url?: string }>(
          '/search/upload',
          formData
        )
        return response.imageUrl || response.image_url || URL.createObjectURL(image)
      } catch {
        // Last resort: create local object URL
        return URL.createObjectURL(image)
      }
    }
  }

  async getProcessingStatus(searchId: string): Promise<ImageProcessingStatus> {
    try {
      const response = await apiClient.get<{
        success?: boolean
        data?: ImageProcessingStatus
        status?: string
        progress?: number
      }>(`/search/status/${searchId}/`)

      const data = response.data || response
      return {
        status: (data.status as ImageProcessingStatus['status']) || 'completed',
        progress: data.progress || 100,
      }
    } catch {
      // If endpoint doesn't exist, return completed
      return { status: 'completed', progress: 100 }
    }
  }

  async getRecentSearches(
    _userId: string,
    limit: number = 10
  ): Promise<{ id: string; imageUrl: string; timestamp: Date }[]> {
    try {
      const response = await apiClient.get<{
        success?: boolean
        data?: {
          results?: Array<{
            id: string
            image_url?: string
            imageUrl?: string
            created_at?: string
            timestamp?: string
          }>
        }
        results?: Array<{
          id: string
          image_url?: string
          imageUrl?: string
          created_at?: string
          timestamp?: string
        }>
      }>(`/search/history/?limit=${limit}`)

      const data = response.data || response
      const results = data.results || []

      return results.map((item) => ({
        id: String(item.id),
        imageUrl: item.image_url || item.imageUrl || '',
        timestamp: new Date(item.created_at || item.timestamp || new Date()),
      }))
    } catch {
      // If endpoint doesn't exist, return empty array
      return []
    }
  }

  async deleteSearchHistory(_userId: string): Promise<void> {
    try {
      await apiClient.delete(`/search/history/`)
    } catch {
      // Silently fail if endpoint doesn't exist
    }
  }

  // Text-based search - searches outfits and users in parallel
  async performTextSearch(request: TextSearchRequest): Promise<TextSearchResponse> {
    const { query, page = 1, limit = 10, filters } = request

    // Build query params for outfits search
    const outfitParams = new URLSearchParams()
    outfitParams.append('search', query)
    outfitParams.append('page', page.toString())
    outfitParams.append('limit', limit.toString())
    if (filters?.occasion) outfitParams.append('occasion', filters.occasion)
    if (filters?.season) outfitParams.append('season', filters.season)

    // Build query params for users search
    const userParams = new URLSearchParams()
    userParams.append('search', query)
    userParams.append('page', '1')
    userParams.append('limit', '5') // Limit users in combined search

    // Search outfits and users in parallel
    const [outfitsResponse, usersResponse] = await Promise.all([
      apiClient
        .get<{
          count: number
          results: any[]
        }>(`/outfits/?${outfitParams.toString()}`)
        .catch(() => ({ count: 0, results: [] })),
      apiClient
        .get<{
          count: number
          results: any[]
        }>(`/auth/users/search/?${userParams.toString()}`)
        .catch(() => ({ count: 0, results: [] })),
    ])

    // Transform outfit results
    const outfits: TextSearchOutfitResult[] = (outfitsResponse.results || []).map(
      (outfit: any) => ({
        id: String(outfit.id),
        title: outfit.title || outfit.name || 'Untitled',
        description: outfit.description,
        mainImage: outfit.main_image || outfit.mainImage || outfit.thumbnail || '',
        totalPrice: parseFloat(String(outfit.total_price || outfit.totalPrice || 0)),
        occasion: outfit.occasion,
        season: outfit.season,
        likesCount: outfit.likes_count || outfit.likes || 0,
        user: outfit.user
          ? {
              id: String(outfit.user.id),
              username: outfit.user.username || '',
              photoUrl:
                outfit.user.photo_url || outfit.user.photoUrl || outfit.user.profile?.photo_url,
            }
          : undefined,
      })
    )

    // Transform user results
    const users: TextSearchUserResult[] = (usersResponse.results || []).map((user: any) => ({
      id: String(user.id),
      username: user.username || '',
      fullName:
        user.full_name ||
        user.fullName ||
        `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
        user.username,
      photoUrl: user.photo_url || user.photoUrl || user.profile?.photo_url,
      bio: user.bio || user.profile?.bio,
      followersCount: user.followers_count || user.followersCount || 0,
      isFollowing: user.is_following || user.isFollowing || false,
    }))

    return {
      outfits,
      users,
      totalOutfits: outfitsResponse.count || 0,
      totalUsers: usersResponse.count || 0,
    }
  }
}
