export interface WardrobeItemAttribute {
  key: string
  value: string
}

export interface WardrobeItem {
  id: string
  wardrobeId: string
  category: 'top' | 'bottom' | 'shoes' | 'accessory' | 'outerwear' | 'dress' | 'bag'
  name: string
  brand?: string
  color: string
  size?: string
  price?: number
  currency?: string
  purchaseDate?: Date
  material?: string
  images: string[]
  attributes: WardrobeItemAttribute[]
  tags: string[]
  notes?: string
  timesWorn: number
  purchaseLink?: string
  createdAt: Date
  updatedAt: Date
}

export interface Wardrobe {
  id: string
  userId: string
  name: string
  items: WardrobeItem[]
  totalItems: number
  categories: {
    tops: number
    bottoms: number
    shoes: number
    accessories: number
    outerwear: number
    dresses: number
  }
  mostWornItem?: WardrobeItem
  createdAt: Date
  updatedAt: Date
}

export interface WardrobeStats {
  totalItems: number
  totalOutfits: number
  mostWornCategory: string
  averageItemPrice: number
  totalValue: number
  itemsByColor: Record<string, number>
  itemsByBrand: Record<string, number>
}
