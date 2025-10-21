import { IOutfitRepository, PaginatedResponse } from '@domain/repositories/IOutfitRepository'
import { Outfit, OutfitRecommendation, OutfitFilter } from '@domain/entities/Outfit'
import { apiClient } from '../api/ApiClient'

export class OutfitRepository implements IOutfitRepository {
  async getRecommendations(
    userId: string,
    filters?: OutfitFilter,
    page: number = 1,
    limit: number = 12
  ): Promise<PaginatedResponse<OutfitRecommendation>> {
    return await apiClient.post<PaginatedResponse<OutfitRecommendation>>(
      '/outfits/recommendations',
      {
        userId,
        filters,
        page,
        limit,
      }
    )
  }

  async getOutfitById(outfitId: string): Promise<Outfit> {
    return await apiClient.get<Outfit>(`/outfits/${outfitId}`)
  }

  async createOutfit(outfit: Omit<Outfit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Outfit> {
    return await apiClient.post<Outfit>('/outfits', outfit)
  }

  async updateOutfit(outfitId: string, updates: Partial<Outfit>): Promise<Outfit> {
    return await apiClient.patch<Outfit>(`/outfits/${outfitId}`, updates)
  }

  async deleteOutfit(outfitId: string): Promise<void> {
    await apiClient.delete(`/outfits/${outfitId}`)
  }

  async likeOutfit(userId: string, outfitId: string): Promise<void> {
    await apiClient.post(`/outfits/${outfitId}/like`, { userId })
  }

  async unlikeOutfit(userId: string, outfitId: string): Promise<void> {
    await apiClient.delete(`/outfits/${outfitId}/like`)
  }

  async saveOutfit(userId: string, outfitId: string): Promise<void> {
    await apiClient.post(`/outfits/${outfitId}/save`, { userId })
  }

  async unsaveOutfit(userId: string, outfitId: string): Promise<void> {
    await apiClient.delete(`/outfits/${outfitId}/save`)
  }

  async getSavedOutfits(
    userId: string,
    page: number = 1,
    limit: number = 12
  ): Promise<PaginatedResponse<Outfit>> {
    return await apiClient.get<PaginatedResponse<Outfit>>(
      `/users/${userId}/saved-outfits?page=${page}&limit=${limit}`
    )
  }

  async provideFeedback(outfitId: string, helpful: boolean, feedback?: string): Promise<void> {
    await apiClient.post(`/outfits/${outfitId}/feedback`, { helpful, feedback })
  }
}
