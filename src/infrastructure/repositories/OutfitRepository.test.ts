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
        styles: ['streetwear'],
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

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await outfitRepository.getRecommendations(userId, filters, 1, 12)

      expect(apiClient.get).toHaveBeenCalledWith(
        '/outfits/?occasion=casual&styles=streetwear&page=1&limit=12'
      )
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

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await outfitRepository.getRecommendations(userId)

      expect(apiClient.get).toHaveBeenCalledWith('/outfits/?page=1&limit=12')
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

      expect(apiClient.get).toHaveBeenCalledWith(`/outfits/${outfitId}/`)
      expect(result).toEqual(mockOutfit)
    })

    it('should throw error when outfit not found', async () => {
      const outfitId = 'nonexistent'
      vi.mocked(apiClient.get).mockRejectedValue(new Error('Not found'))

      await expect(outfitRepository.getOutfitById(outfitId)).rejects.toThrow('Not found')
    })
  })

  describe('createOutfit', () => {
    it('should throw error as endpoint not implemented', async () => {
      const newOutfit = {
        name: 'New Outfit',
        items: ['item1', 'item2'],
      } as unknown as Omit<Outfit, 'id' | 'createdAt' | 'updatedAt'>

      await expect(outfitRepository.createOutfit(newOutfit)).rejects.toThrow(
        'Create outfit endpoint not implemented in backend API'
      )
    })
  })

  describe('updateOutfit', () => {
    it('should throw error as endpoint not implemented', async () => {
      const outfitId = 'outfit123'
      const updates: Partial<Outfit> = {
        name: 'Updated Name',
      }

      await expect(outfitRepository.updateOutfit(outfitId, updates)).rejects.toThrow(
        'Update outfit endpoint not implemented in backend API'
      )
    })
  })

  describe('deleteOutfit', () => {
    it('should throw error as endpoint not implemented', async () => {
      const outfitId = 'outfit123'

      await expect(outfitRepository.deleteOutfit(outfitId)).rejects.toThrow(
        'Delete outfit endpoint not implemented in backend API'
      )
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

      expect(apiClient.get).toHaveBeenCalledWith(`/outfits/user/${userId}/?page=1&limit=12`)
      expect(result).toEqual(mockResponse)
    })
  })

  describe('provideFeedback', () => {
    it('should throw error as endpoint not implemented', async () => {
      const outfitId = 'outfit123'
      const helpful = true
      const feedback = 'Great recommendation!'

      await expect(outfitRepository.provideFeedback(outfitId, helpful, feedback)).rejects.toThrow(
        'Outfit feedback endpoint not implemented in backend API'
      )
    })

    it('should throw error for negative feedback', async () => {
      const outfitId = 'outfit123'
      const helpful = false

      await expect(outfitRepository.provideFeedback(outfitId, helpful)).rejects.toThrow(
        'Outfit feedback endpoint not implemented in backend API'
      )
    })
  })
})
