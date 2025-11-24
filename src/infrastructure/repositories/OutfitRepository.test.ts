import { describe, it, expect, beforeEach, vi } from 'vitest'
import { OutfitRepository } from './OutfitRepository'
import { apiClient } from '../api/ApiClient'
import type { PaginatedResponse } from '@domain/repositories/IOutfitRepository'
import type { Outfit, OutfitRecommendation, OutfitFilter } from '@domain/entities/Outfit'

vi.mock('../api/ApiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('OutfitRepository', () => {
  let outfitRepository: OutfitRepository

  beforeEach(() => {
    outfitRepository = new OutfitRepository()
    vi.clearAllMocks()
  })

  describe('getRecommendations', () => {
    it('should get outfit recommendations with filters', async () => {
      const userId = 'user123'
      const filters: OutfitFilter = {
        occasion: ['casual'],
        season: ['summer'],
      }
      const mockResponse: PaginatedResponse<OutfitRecommendation> = {
        results: [
          {
            id: 'outfit1',
            name: 'Summer Casual',
            items: [],
          } as unknown as OutfitRecommendation,
        ],
        count: 1,
        currentPage: 1,
        totalPages: 1,
        hasMore: false,
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const result = await outfitRepository.getRecommendations(userId, filters, 1, 12)

      expect(apiClient.post).toHaveBeenCalledWith('/outfits/recommendations', {
        userId,
        filters,
        page: 1,
        limit: 12,
      })
      expect(result).toEqual(mockResponse)
    })

    it('should get recommendations without filters', async () => {
      const userId = 'user123'
      const mockResponse: PaginatedResponse<OutfitRecommendation> = {
        results: [],
        count: 0,
        currentPage: 1,
        totalPages: 0,
        hasMore: false,
      }

      vi.mocked(apiClient.post).mockResolvedValue(mockResponse)

      const result = await outfitRepository.getRecommendations(userId)

      expect(apiClient.post).toHaveBeenCalledWith('/outfits/recommendations', {
        userId,
        filters: undefined,
        page: 1,
        limit: 12,
      })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getOutfitById', () => {
    it('should get outfit by ID', async () => {
      const outfitId = 'outfit123'
      const mockOutfit: Outfit = {
        id: outfitId,
        name: 'Test Outfit',
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as unknown as Outfit

      vi.mocked(apiClient.get).mockResolvedValue(mockOutfit)

      const result = await outfitRepository.getOutfitById(outfitId)

      expect(apiClient.get).toHaveBeenCalledWith(`/outfits/${outfitId}`)
      expect(result).toEqual(mockOutfit)
    })

    it('should throw error when outfit not found', async () => {
      const outfitId = 'nonexistent'
      vi.mocked(apiClient.get).mockRejectedValue(new Error('Not found'))

      await expect(outfitRepository.getOutfitById(outfitId)).rejects.toThrow('Not found')
    })
  })

  describe('createOutfit', () => {
    it('should create a new outfit', async () => {
      const newOutfit = {
        name: 'New Outfit',
        items: ['item1', 'item2'],
      } as unknown as Omit<Outfit, 'id' | 'createdAt' | 'updatedAt'>

      const mockCreatedOutfit: Outfit = {
        id: 'outfit123',
        ...newOutfit,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as unknown as Outfit

      vi.mocked(apiClient.post).mockResolvedValue(mockCreatedOutfit)

      const result = await outfitRepository.createOutfit(newOutfit)

      expect(apiClient.post).toHaveBeenCalledWith('/outfits', newOutfit)
      expect(result).toEqual(mockCreatedOutfit)
    })
  })

  describe('updateOutfit', () => {
    it('should update an outfit', async () => {
      const outfitId = 'outfit123'
      const updates: Partial<Outfit> = {
        name: 'Updated Name',
      }

      const mockUpdatedOutfit: Outfit = {
        id: outfitId,
        name: 'Updated Name',
        items: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as unknown as Outfit

      vi.mocked(apiClient.patch).mockResolvedValue(mockUpdatedOutfit)

      const result = await outfitRepository.updateOutfit(outfitId, updates)

      expect(apiClient.patch).toHaveBeenCalledWith(`/outfits/${outfitId}`, updates)
      expect(result).toEqual(mockUpdatedOutfit)
    })
  })

  describe('deleteOutfit', () => {
    it('should delete an outfit', async () => {
      const outfitId = 'outfit123'
      vi.mocked(apiClient.delete).mockResolvedValue(undefined)

      await outfitRepository.deleteOutfit(outfitId)

      expect(apiClient.delete).toHaveBeenCalledWith(`/outfits/${outfitId}`)
    })
  })

  describe('likeOutfit', () => {
    it('should like an outfit', async () => {
      const userId = 'user123'
      const outfitId = 'outfit123'
      vi.mocked(apiClient.post).mockResolvedValue(undefined)

      await outfitRepository.likeOutfit(userId, outfitId)

      expect(apiClient.post).toHaveBeenCalledWith(`/outfits/${outfitId}/like`, { userId })
    })
  })

  describe('unlikeOutfit', () => {
    it('should unlike an outfit', async () => {
      const userId = 'user123'
      const outfitId = 'outfit123'
      vi.mocked(apiClient.delete).mockResolvedValue(undefined)

      await outfitRepository.unlikeOutfit(userId, outfitId)

      expect(apiClient.delete).toHaveBeenCalledWith(`/outfits/${outfitId}/like`)
    })
  })

  describe('saveOutfit', () => {
    it('should save an outfit', async () => {
      const userId = 'user123'
      const outfitId = 'outfit123'
      vi.mocked(apiClient.post).mockResolvedValue(undefined)

      await outfitRepository.saveOutfit(userId, outfitId)

      expect(apiClient.post).toHaveBeenCalledWith(`/outfits/${outfitId}/save`, { userId })
    })
  })

  describe('unsaveOutfit', () => {
    it('should unsave an outfit', async () => {
      const userId = 'user123'
      const outfitId = 'outfit123'
      vi.mocked(apiClient.delete).mockResolvedValue(undefined)

      await outfitRepository.unsaveOutfit(userId, outfitId)

      expect(apiClient.delete).toHaveBeenCalledWith(`/outfits/${outfitId}/save`)
    })
  })

  describe('getSavedOutfits', () => {
    it('should get saved outfits for a user', async () => {
      const userId = 'user123'
      const mockResponse: PaginatedResponse<Outfit> = {
        results: [
          {
            id: 'outfit1',
            name: 'Saved Outfit 1',
            items: [],
          } as unknown as Outfit,
        ],
        count: 1,
        currentPage: 1,
        totalPages: 1,
        hasMore: false,
      }

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await outfitRepository.getSavedOutfits(userId, 1, 12)

      expect(apiClient.get).toHaveBeenCalledWith(`/users/${userId}/saved-outfits?page=1&limit=12`)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('provideFeedback', () => {
    it('should provide positive feedback for an outfit', async () => {
      const outfitId = 'outfit123'
      const helpful = true
      const feedback = 'Great recommendation!'

      vi.mocked(apiClient.post).mockResolvedValue(undefined)

      await outfitRepository.provideFeedback(outfitId, helpful, feedback)

      expect(apiClient.post).toHaveBeenCalledWith(`/outfits/${outfitId}/feedback`, {
        helpful,
        feedback,
      })
    })

    it('should provide negative feedback without comment', async () => {
      const outfitId = 'outfit123'
      const helpful = false

      vi.mocked(apiClient.post).mockResolvedValue(undefined)

      await outfitRepository.provideFeedback(outfitId, helpful)

      expect(apiClient.post).toHaveBeenCalledWith(`/outfits/${outfitId}/feedback`, {
        helpful,
        feedback: undefined,
      })
    })
  })
})
