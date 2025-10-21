import { Outfit, OutfitRecommendation, OutfitFilter } from '../entities/Outfit'

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  hasMore: boolean
}

export interface IOutfitRepository {
  getRecommendations(
    userId: string,
    filters?: OutfitFilter,
    page?: number,
    limit?: number
  ): Promise<PaginatedResponse<OutfitRecommendation>>
  getOutfitById(outfitId: string): Promise<Outfit>
  createOutfit(outfit: Omit<Outfit, 'id' | 'createdAt' | 'updatedAt'>): Promise<Outfit>
  updateOutfit(outfitId: string, updates: Partial<Outfit>): Promise<Outfit>
  deleteOutfit(outfitId: string): Promise<void>
  likeOutfit(userId: string, outfitId: string): Promise<void>
  unlikeOutfit(userId: string, outfitId: string): Promise<void>
  saveOutfit(userId: string, outfitId: string): Promise<void>
  unsaveOutfit(userId: string, outfitId: string): Promise<void>
  getSavedOutfits(userId: string, page?: number, limit?: number): Promise<PaginatedResponse<Outfit>>
  provideFeedback(outfitId: string, helpful: boolean, feedback?: string): Promise<void>
}
