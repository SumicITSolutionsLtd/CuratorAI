import { Lookbook, LookbookFilter } from '../entities/Lookbook'
import { PaginatedResponse } from './IOutfitRepository'

export interface ILookbookRepository {
  getLookbooks(filter?: LookbookFilter, page?: number, limit?: number): Promise<PaginatedResponse<Lookbook>>
  getFeaturedLookbooks(limit?: number): Promise<Lookbook[]>
  getLookbookById(lookbookId: string): Promise<Lookbook>
  createLookbook(lookbook: Omit<Lookbook, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lookbook>
  updateLookbook(lookbookId: string, updates: Partial<Lookbook>): Promise<Lookbook>
  deleteLookbook(lookbookId: string): Promise<void>
  likeLookbook(userId: string, lookbookId: string): Promise<void>
  unlikeLookbook(userId: string, lookbookId: string): Promise<void>
}
