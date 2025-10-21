import { IWardrobeRepository } from '@domain/repositories/IWardrobeRepository'
import { WardrobeItem } from '@domain/entities/Wardrobe'

export class AddWardrobeItemUseCase {
  constructor(private wardrobeRepository: IWardrobeRepository) {}

  async execute(
    item: Omit<WardrobeItem, 'id' | 'createdAt' | 'updatedAt' | 'timesWorn'>
  ): Promise<WardrobeItem> {
    // Validate required fields
    if (!item.name || !item.category) {
      throw new Error('Item name and category are required')
    }

    // Set default values
    const itemWithDefaults = {
      ...item,
      timesWorn: 0,
      tags: item.tags || [],
      images: item.images || [],
      attributes: item.attributes || [],
    }

    return await this.wardrobeRepository.addItem(itemWithDefaults)
  }
}
