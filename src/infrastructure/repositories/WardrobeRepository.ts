import { IWardrobeRepository } from '@domain/repositories/IWardrobeRepository'
import { Wardrobe, WardrobeItem, WardrobeStats } from '@domain/entities/Wardrobe'
import { apiClient } from '../api/ApiClient'

export class WardrobeRepository implements IWardrobeRepository {
  async getWardrobe(userId: string): Promise<Wardrobe> {
    return await apiClient.get<Wardrobe>(`/wardrobe/users/${userId}/wardrobe/`)
  }

  async getWardrobeStats(userId: string): Promise<WardrobeStats> {
    return await apiClient.get<WardrobeStats>(`/wardrobe/users/${userId}/wardrobe/stats/`)
  }

  async addItem(item: Omit<WardrobeItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<WardrobeItem> {
    return await apiClient.post<WardrobeItem>('/wardrobe/items/create/', item)
  }

  async updateItem(itemId: string, updates: Partial<WardrobeItem>): Promise<WardrobeItem> {
    return await apiClient.put<WardrobeItem>(`/wardrobe/items/${itemId}/update/`, updates)
  }

  async deleteItem(itemId: string): Promise<void> {
    await apiClient.delete(`/wardrobe/items/${itemId}/delete/`)
  }

  async getItemById(itemId: string): Promise<WardrobeItem> {
    return await apiClient.get<WardrobeItem>(`/wardrobe/items/${itemId}`)
  }

  async getItemsByCategory(userId: string, category: string): Promise<WardrobeItem[]> {
    return await apiClient.get<WardrobeItem[]>(
      `/wardrobe/items/?user_id=${userId}&category=${category}`
    )
  }

  async uploadItemImage(itemId: string, image: File): Promise<string> {
    const formData = new FormData()
    formData.append('image', image)
    const response = await apiClient.upload<{ imageUrl: string }>(
      `/wardrobe/items/${itemId}/images`,
      formData
    )
    return response.imageUrl
  }

  async incrementTimesWorn(itemId: string): Promise<WardrobeItem> {
    return await apiClient.post<WardrobeItem>(`/wardrobe/items/${itemId}/worn`)
  }
}
