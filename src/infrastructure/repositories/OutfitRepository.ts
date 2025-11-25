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
    return await apiClient.get<Outfit>(`/outfits/${outfitId}`)
  }

  async createOutfit(_outfit: Omit<Outfit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Outfit> {
    // TODO: POST /outfits endpoint doesn't exist in API docs
    // This method may not work until backend implements it
    throw new Error('Create outfit endpoint not implemented in backend API')
  }

  async updateOutfit(_outfitId: string, _updates: Partial<Outfit>): Promise<Outfit> {
    // TODO: PATCH /outfits/{id} endpoint doesn't exist in API docs
    // This method may not work until backend implements it
    throw new Error('Update outfit endpoint not implemented in backend API')
  }

  async deleteOutfit(_outfitId: string): Promise<void> {
    // TODO: DELETE /outfits/{id} endpoint doesn't exist in API docs
    // This method may not work until backend implements it
    throw new Error('Delete outfit endpoint not implemented in backend API')
  }

  async likeOutfit(userId: string, outfitId: string): Promise<void> {
    await apiClient.post(`/outfits/${outfitId}/like`, { userId })
  }

  async unlikeOutfit(_userId: string, outfitId: string): Promise<void> {
    await apiClient.delete(`/outfits/${outfitId}/like`)
  }

  async saveOutfit(userId: string, outfitId: string): Promise<void> {
    await apiClient.post(`/outfits/${outfitId}/save`, { userId })
  }

  async unsaveOutfit(_userId: string, outfitId: string): Promise<void> {
    await apiClient.delete(`/outfits/${outfitId}/save`)
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
}
