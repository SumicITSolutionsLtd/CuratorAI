import { IOutfitRepository, PaginatedResponse } from '@domain/repositories/IOutfitRepository'
import { Outfit, OutfitRecommendation, OutfitFilter } from '@domain/entities/Outfit'
import { apiClient } from '../api/ApiClient'

export class OutfitRepository implements IOutfitRepository {
  async getRecommendations(
    _userId: string,
    filters?: OutfitFilter,
    page: number = 1,
    limit: number = 12
  ): Promise<PaginatedResponse<OutfitRecommendation>> {
    // TODO: This endpoint doesn't exist in API docs - verify with backend team
    // Using GET /outfits/ as fallback
    const params = new URLSearchParams()
    if (filters?.occasion) params.append('occasion', filters.occasion.join(','))
    if (filters?.styles) params.append('styles', filters.styles.join(','))
    params.append('page', page.toString())
    params.append('limit', limit.toString())

    return await apiClient.get<PaginatedResponse<OutfitRecommendation>>(
      `/outfits/?${params.toString()}`
    )
  }

  async getOutfitById(outfitId: string): Promise<Outfit> {
    const response = await apiClient.get<any>(`/outfits/${outfitId}/`)
    return this.transformOutfit(response.data || response)
  }

  async createOutfit(outfit: Omit<Outfit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Outfit> {
    // Transform to backend format matching OutfitCreateRequest schema
    const payload = {
      title: outfit.name, // API uses 'title' not 'name'
      description: outfit.description || '',
      items: outfit.items.map((item) => ({
        wardrobe_item_id: item.id,
        position: 0,
      })),
      style_tags: outfit.styleAttributes || outfit.tags || [],
      occasion: outfit.occasion || 'casual',
      season: outfit.season || 'all_season',
      is_public: outfit.isPublic ?? false,
      color_palette: [],
    }
    const response = await apiClient.post<any>('/outfits/', payload)
    return this.transformOutfit(response.data || response)
  }

  async updateOutfit(outfitId: string, updates: Partial<Outfit>): Promise<Outfit> {
    const payload: any = {}
    if (updates.name) payload.title = updates.name // API uses 'title'
    if (updates.description !== undefined) payload.description = updates.description
    if (updates.items)
      payload.items = updates.items.map((item) => ({
        wardrobe_item_id: item.id,
        position: 0,
      }))
    if (updates.styleAttributes) payload.style_tags = updates.styleAttributes
    if (updates.occasion) payload.occasion = updates.occasion
    if (updates.season) payload.season = updates.season
    if (updates.isPublic !== undefined) payload.is_public = updates.isPublic
    if (updates.tags) payload.style_tags = updates.tags

    const response = await apiClient.put<any>(`/outfits/${outfitId}/`, payload)
    return this.transformOutfit(response.data || response)
  }

  async deleteOutfit(outfitId: string): Promise<void> {
    await apiClient.delete(`/outfits/${outfitId}/`)
  }

  // Transform backend response to frontend format
  private transformOutfit(backendOutfit: any): Outfit {
    const items = this.transformOutfitItems(backendOutfit.items || [])
    return {
      id: backendOutfit.id?.toString() || '',
      userId:
        backendOutfit.user_id?.toString() ||
        backendOutfit.user?.id?.toString() ||
        backendOutfit.userId ||
        '',
      name: backendOutfit.title || backendOutfit.name || '', // API uses 'title'
      description: backendOutfit.description,
      mainImage: backendOutfit.main_image || backendOutfit.mainImage || items[0]?.imageUrl,
      thumbnail: backendOutfit.thumbnail || backendOutfit.main_image || items[0]?.imageUrl,
      items,
      styleAttributes:
        backendOutfit.style_tags ||
        backendOutfit.style_attributes ||
        backendOutfit.styleAttributes ||
        [],
      occasion: backendOutfit.occasion,
      season: backendOutfit.season,
      confidenceScore: backendOutfit.confidence_score || backendOutfit.confidenceScore || 0,
      totalPrice: parseFloat(backendOutfit.total_price || backendOutfit.totalPrice) || 0,
      currency: backendOutfit.currency || 'USD',
      isPublic: backendOutfit.is_public ?? backendOutfit.isPublic ?? false,
      tags: backendOutfit.style_tags || backendOutfit.tags || [],
      likes: backendOutfit.likes_count || backendOutfit.likes || 0,
      saves: backendOutfit.saves_count || backendOutfit.saves || 0,
      shares: backendOutfit.shares_count || backendOutfit.shares || 0,
      isLiked: backendOutfit.is_liked || backendOutfit.isLiked || false,
      isSaved: backendOutfit.is_saved || backendOutfit.isSaved || false,
      createdAt: new Date(backendOutfit.created_at || backendOutfit.createdAt || new Date()),
      updatedAt: new Date(backendOutfit.updated_at || backendOutfit.updatedAt || new Date()),
    }
  }

  // Transform outfit items from backend format
  private transformOutfitItems(items: any[]): Outfit['items'] {
    return items.map((item) => ({
      id: item.id?.toString() || item.wardrobe_item_id?.toString() || '',
      category: item.category || 'top',
      brand: item.brand || '',
      name: item.name || '',
      price: parseFloat(item.price) || 0,
      currency: item.currency || 'USD',
      size: item.size,
      color: item.color || '',
      imageUrl: item.image_url || item.imageUrl || item.images?.[0] || '',
      productUrl: item.product_url || item.productUrl,
      inStock: item.in_stock ?? item.inStock ?? true,
    }))
  }

  async likeOutfit(_userId: string, outfitId: string): Promise<void> {
    await apiClient.post(`/outfits/${outfitId}/like/`, {})
  }

  async unlikeOutfit(_userId: string, outfitId: string): Promise<void> {
    // Toggle - same endpoint for like/unlike
    await apiClient.post(`/outfits/${outfitId}/like/`, {})
  }

  async saveOutfit(_userId: string, outfitId: string): Promise<void> {
    await apiClient.post(`/outfits/${outfitId}/save/`, {})
  }

  async unsaveOutfit(_userId: string, outfitId: string): Promise<void> {
    // Toggle - same endpoint for save/unsave
    await apiClient.post(`/outfits/${outfitId}/save/`, {})
  }

  async getSavedOutfits(
    userId: string,
    page: number = 1,
    limit: number = 12
  ): Promise<PaginatedResponse<Outfit>> {
    // TODO: /users/{id}/saved-outfits endpoint doesn't exist in API docs
    // Using /outfits/user/{user_id}/ as alternative
    return await apiClient.get<PaginatedResponse<Outfit>>(
      `/outfits/user/${userId}/?page=${page}&limit=${limit}`
    )
  }

  async provideFeedback(_outfitId: string, _helpful: boolean, _feedback?: string): Promise<void> {
    // TODO: /outfits/{id}/feedback endpoint doesn't exist in API docs
    // This method may not work until backend implements it
    throw new Error('Outfit feedback endpoint not implemented in backend API')
  }

  async getUserOutfits(
    userId: string,
    page: number = 1,
    limit: number = 12
  ): Promise<PaginatedResponse<Outfit>> {
    const response = await apiClient.get<{
      count: number
      next?: string
      previous?: string
      results: any[]
    }>(`/outfits/user/${userId}/?page=${page}&limit=${limit}`)

    const totalPages = Math.ceil(response.count / limit)

    return {
      results: response.results.map((outfit) => this.transformOutfit(outfit)),
      count: response.count,
      currentPage: page,
      totalPages,
      hasMore: !!response.next,
    }
  }
}
