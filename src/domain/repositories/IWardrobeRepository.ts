import { Wardrobe, WardrobeItem, WardrobeStats } from '../entities/Wardrobe'

export interface IWardrobeRepository {
  getWardrobe(userId: string): Promise<Wardrobe>
  getWardrobeStats(userId: string): Promise<WardrobeStats>
  addItem(item: Omit<WardrobeItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<WardrobeItem>
  updateItem(itemId: string, updates: Partial<WardrobeItem>): Promise<WardrobeItem>
  deleteItem(itemId: string): Promise<void>
  getItemById(itemId: string): Promise<WardrobeItem>
  getItemsByCategory(userId: string, category: string): Promise<WardrobeItem[]>
  uploadItemImage(itemId: string, image: File): Promise<string>
  incrementTimesWorn(itemId: string): Promise<WardrobeItem>
}
