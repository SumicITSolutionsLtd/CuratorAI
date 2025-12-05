import { ILookbookRepository } from '@domain/repositories/ILookbookRepository'
import { Lookbook, LookbookFilter, LookbookOutfit } from '@domain/entities/Lookbook'
import { PaginatedResponse } from '@domain/repositories/IOutfitRepository'
import { apiClient } from '../api/ApiClient'

export class LookbookRepository implements ILookbookRepository {
  // Transform backend lookbook to frontend format
  private transformLookbook(backend: any): Lookbook {
    return {
      id: backend.id?.toString() || '',
      creatorId: backend.creator_id?.toString() || backend.user?.id?.toString() || '',
      creator: {
        id: backend.creator?.id?.toString() || backend.user?.id?.toString() || '',
        username: backend.creator?.username || backend.user?.username || '',
        fullName:
          backend.creator?.full_name || backend.user?.full_name || backend.creator?.fullName || '',
        photoUrl:
          backend.creator?.photo_url || backend.user?.profile_picture || backend.creator?.photoUrl,
      },
      title: backend.title || '',
      description: backend.description || '',
      coverImage: backend.cover_image || backend.coverImage || '',
      outfits: this.transformOutfits(backend.outfits || []),
      priceRange: {
        min: backend.price_range?.min || backend.priceRange?.min || 0,
        max: backend.price_range?.max || backend.priceRange?.max || 0,
        currency: backend.price_range?.currency || backend.priceRange?.currency || 'USD',
      },
      season: backend.season,
      occasion: backend.occasion,
      style: backend.style_tags || backend.style || [],
      totalValue: backend.total_value || backend.totalValue || 0,
      likes: backend.likes_count || backend.likes || 0,
      views: backend.views_count || backend.views || 0,
      comments: backend.comments_count || backend.comments || 0,
      isPublic: backend.is_public ?? backend.isPublic ?? true,
      isFeatured: backend.is_featured ?? backend.isFeatured ?? false,
      isLiked: backend.is_liked ?? backend.isLiked ?? false,
      isSaved: backend.is_saved ?? backend.isSaved ?? false,
      tags: backend.tags || [],
      createdAt: new Date(backend.created_at || backend.createdAt || new Date()),
      updatedAt: new Date(backend.updated_at || backend.updatedAt || new Date()),
    }
  }

  private transformOutfits(backendOutfits: any[]): LookbookOutfit[] {
    return backendOutfits.map((o, index) => ({
      id: o.id?.toString() || '',
      outfitId: o.outfit_id?.toString() || o.outfitId?.toString() || o.outfit?.id?.toString() || '',
      outfit: {
        name: o.outfit?.name || o.outfit?.title || '',
        description: o.outfit?.description || '',
        images: o.outfit?.images || [o.outfit?.main_image].filter(Boolean) || [],
        items: (o.outfit?.items || []).map((item: any) => ({
          id: item.id?.toString() || '',
          name: item.name || '',
          brand: item.brand || '',
          price: parseFloat(item.price) || 0,
          imageUrl: item.image_url || item.imageUrl || item.image || '',
          productUrl: item.product_url || item.productUrl,
        })),
        totalPrice: o.outfit?.total_price || o.outfit?.totalPrice || 0,
      },
      order: o.order ?? o.position ?? index,
    }))
  }

  async getLookbooks(
    filter?: LookbookFilter,
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<Lookbook>> {
    const params: any = {}
    if (filter?.season) params.season = filter.season.join(',')
    if (filter?.occasion) params.occasion = filter.occasion.join(',')
    if (filter?.style) params.style = filter.style.join(',')
    if (filter?.featured !== undefined) params.featured = filter.featured
    if (filter?.priceRange) {
      params.minPrice = filter.priceRange.min
      params.maxPrice = filter.priceRange.max
    }
    if (page) params.page = page
    if (limit) params.limit = limit

    const response = await apiClient.get<any>('/lookbooks/', { params })
    const data = response.data || response

    return {
      results: (data.results || []).map((l: any) => this.transformLookbook(l)),
      count: data.count || 0,
      currentPage: data.current_page || page || 1,
      totalPages: data.total_pages || Math.ceil((data.count || 0) / (limit || 12)),
      hasMore: data.has_more ?? data.next !== null,
    }
  }

  async getFeaturedLookbooks(limit?: number): Promise<Lookbook[]> {
    const params = limit ? { limit } : {}
    const response = await apiClient.get<any>('/lookbooks/featured/', { params })
    const data = response.data || response
    const results = data.results || data
    return (Array.isArray(results) ? results : []).map((l: any) => this.transformLookbook(l))
  }

  async getLookbookById(lookbookId: string): Promise<Lookbook> {
    const response = await apiClient.get<any>(`/lookbooks/${lookbookId}/`)
    return this.transformLookbook(response.data || response)
  }

  async createLookbook(
    lookbook: Omit<Lookbook, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Lookbook> {
    // Transform to backend format
    const payload = {
      title: lookbook.title,
      description: lookbook.description,
      cover_image: lookbook.coverImage,
      season: lookbook.season,
      occasion: lookbook.occasion,
      style_tags: lookbook.style,
      is_public: lookbook.isPublic,
      tags: lookbook.tags,
      outfits: lookbook.outfits.map((o, index) => ({
        outfit_id: o.outfitId,
        position: o.order ?? index,
      })),
    }
    const response = await apiClient.post<any>('/lookbooks/create/', payload)
    return this.transformLookbook(response.data || response)
  }

  async updateLookbook(lookbookId: string, updates: Partial<Lookbook>): Promise<Lookbook> {
    const payload: any = {}
    if (updates.title) payload.title = updates.title
    if (updates.description !== undefined) payload.description = updates.description
    if (updates.coverImage) payload.cover_image = updates.coverImage
    if (updates.season) payload.season = updates.season
    if (updates.occasion) payload.occasion = updates.occasion
    if (updates.style) payload.style_tags = updates.style
    if (updates.isPublic !== undefined) payload.is_public = updates.isPublic
    if (updates.tags) payload.tags = updates.tags
    if (updates.outfits) {
      payload.outfits = updates.outfits.map((o, index) => ({
        outfit_id: o.outfitId,
        position: o.order ?? index,
      }))
    }

    const response = await apiClient.put<any>(`/lookbooks/${lookbookId}/update/`, payload)
    return this.transformLookbook(response.data || response)
  }

  async deleteLookbook(lookbookId: string): Promise<void> {
    await apiClient.delete<void>(`/lookbooks/${lookbookId}/delete/`)
  }

  async likeLookbook(_userId: string, lookbookId: string): Promise<void> {
    // Toggle endpoint - same for like/unlike
    await apiClient.post<void>(`/lookbooks/${lookbookId}/like/`, {})
  }

  async unlikeLookbook(_userId: string, lookbookId: string): Promise<void> {
    // Toggle endpoint - same for like/unlike
    await apiClient.post<void>(`/lookbooks/${lookbookId}/like/`, {})
  }
}
