import { describe, it, expect, beforeEach, vi } from 'vitest'
import { LookbookRepository } from './LookbookRepository'
import { apiClient } from '../api/ApiClient'
import type { Lookbook } from '@domain/entities/Lookbook'

vi.mock('../api/ApiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('LookbookRepository', () => {
  let lookbookRepository: LookbookRepository

  beforeEach(() => {
    lookbookRepository = new LookbookRepository()
    vi.clearAllMocks()
  })

  describe('getLookbooks', () => {
    it('should get paginated lookbooks', async () => {
      const mockResponse = {
        results: [
          {
            id: 'lookbook1',
            title: 'Summer Collection',
            description: 'Summer outfits',
          } as unknown as Lookbook,
        ],
        count: 1,
      }

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await lookbookRepository.getLookbooks(undefined, 1, 12)

      expect(apiClient.get).toHaveBeenCalledWith('/lookbooks/', { params: { page: 1, limit: 12 } })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('getFeaturedLookbooks', () => {
    it('should get featured lookbooks', async () => {
      const mockLookbooks = [
        {
          id: 'lookbook1',
          title: 'Featured Collection',
          isFeatured: true,
        } as unknown as Lookbook,
      ]

      const mockResponse = {
        results: mockLookbooks,
      }

      vi.mocked(apiClient.get).mockResolvedValue(mockResponse)

      const result = await lookbookRepository.getFeaturedLookbooks(8)

      expect(apiClient.get).toHaveBeenCalledWith('/lookbooks/featured/', { params: { limit: 8 } })
      expect(result).toEqual(mockLookbooks)
    })
  })

  describe('getLookbookById', () => {
    it('should get lookbook by ID', async () => {
      const lookbookId = 'lookbook123'
      const mockLookbook: Lookbook = {
        id: lookbookId,
        title: 'Test Lookbook',
        description: 'Test Description',
        outfits: [],
      } as unknown as Lookbook

      vi.mocked(apiClient.get).mockResolvedValue(mockLookbook)

      const result = await lookbookRepository.getLookbookById(lookbookId)

      expect(apiClient.get).toHaveBeenCalledWith(`/lookbooks/${lookbookId}/`)
      expect(result).toEqual(mockLookbook)
    })
  })

  describe('createLookbook', () => {
    it('should create a new lookbook', async () => {
      const newLookbook = {
        title: 'New Lookbook',
        description: 'New Description',
        outfits: [],
      } as unknown as Omit<Lookbook, 'id' | 'createdAt' | 'updatedAt'>

      const mockCreatedLookbook: Lookbook = {
        id: 'lookbook123',
        ...newLookbook,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as unknown as Lookbook

      vi.mocked(apiClient.post).mockResolvedValue(mockCreatedLookbook)

      const result = await lookbookRepository.createLookbook(newLookbook)

      expect(apiClient.post).toHaveBeenCalledWith('/lookbooks/create/', newLookbook)
      expect(result).toEqual(mockCreatedLookbook)
    })
  })

  describe('updateLookbook', () => {
    it('should update a lookbook', async () => {
      const lookbookId = 'lookbook123'
      const updates: Partial<Lookbook> = {
        title: 'Updated Title',
      }

      const mockUpdatedLookbook: Lookbook = {
        id: lookbookId,
        title: 'Updated Title',
        description: 'Description',
        outfits: [],
      } as unknown as Lookbook

      vi.mocked(apiClient.put).mockResolvedValue(mockUpdatedLookbook)

      const result = await lookbookRepository.updateLookbook(lookbookId, updates)

      expect(apiClient.put).toHaveBeenCalledWith(`/lookbooks/${lookbookId}/update/`, updates)
      expect(result).toEqual(mockUpdatedLookbook)
    })
  })

  describe('deleteLookbook', () => {
    it('should delete a lookbook', async () => {
      const lookbookId = 'lookbook123'
      vi.mocked(apiClient.delete).mockResolvedValue(undefined)

      await lookbookRepository.deleteLookbook(lookbookId)

      expect(apiClient.delete).toHaveBeenCalledWith(`/lookbooks/${lookbookId}/delete/`)
    })
  })

  describe('likeLookbook', () => {
    it('should like a lookbook', async () => {
      const userId = 'user123'
      const lookbookId = 'lookbook123'
      vi.mocked(apiClient.post).mockResolvedValue(undefined)

      await lookbookRepository.likeLookbook(userId, lookbookId)

      expect(apiClient.post).toHaveBeenCalledWith(`/lookbooks/${lookbookId}/like/`)
    })
  })

  describe('unlikeLookbook', () => {
    it('should unlike a lookbook', async () => {
      const userId = 'user123'
      const lookbookId = 'lookbook123'
      vi.mocked(apiClient.delete).mockResolvedValue(undefined)

      await lookbookRepository.unlikeLookbook(userId, lookbookId)

      expect(apiClient.delete).toHaveBeenCalledWith(`/lookbooks/${lookbookId}/like/`)
    })
  })
})
