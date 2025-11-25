import { ILookbookRepository } from '@domain/repositories/ILookbookRepository'
import { Lookbook, LookbookFilter } from '@domain/entities/Lookbook'
import { PaginatedResponse } from '@domain/repositories/IOutfitRepository'
import { apiClient } from '../api/ApiClient'

export class LookbookRepository implements ILookbookRepository {
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

    return apiClient.get<PaginatedResponse<Lookbook>>('/lookbooks/', { params })
  }

  async getFeaturedLookbooks(limit?: number): Promise<Lookbook[]> {
    const params = limit ? { limit } : {}
    const response = await apiClient.get<{ results: Lookbook[] }>('/lookbooks/featured/', {
      params,
    })
    return response.results
  }

  async getLookbookById(lookbookId: string): Promise<Lookbook> {
    return apiClient.get<Lookbook>(`/lookbooks/${lookbookId}/`)
  }

  async createLookbook(
    lookbook: Omit<Lookbook, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<Lookbook> {
    return apiClient.post<Lookbook>('/lookbooks/create/', lookbook)
  }

  async updateLookbook(lookbookId: string, updates: Partial<Lookbook>): Promise<Lookbook> {
    return apiClient.put<Lookbook>(`/lookbooks/${lookbookId}/update/`, updates)
  }

  async deleteLookbook(lookbookId: string): Promise<void> {
    await apiClient.delete<void>(`/lookbooks/${lookbookId}/delete/`)
  }

  async likeLookbook(_userId: string, lookbookId: string): Promise<void> {
    await apiClient.post<void>(`/lookbooks/${lookbookId}/like/`)
  }

  async unlikeLookbook(_userId: string, lookbookId: string): Promise<void> {
    await apiClient.delete<void>(`/lookbooks/${lookbookId}/like/`)
  }
}
