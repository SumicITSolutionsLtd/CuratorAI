export interface OutfitItem {
  id: string
  category: 'top' | 'bottom' | 'shoes' | 'accessory' | 'outerwear'
  brand: string
  name: string
  price: number
  currency: string
  size?: string
  color: string
  imageUrl: string
  productUrl?: string
  inStock: boolean
}

export interface Outfit {
  id: string
  userId: string
  name: string
  description?: string
  items: OutfitItem[]
  styleAttributes: string[]
  occasion?: string
  season?: string
  confidenceScore: number
  totalPrice: number
  currency: string
  isPublic: boolean
  tags: string[]
  likes: number
  saves: number
  shares: number
  createdAt: Date
  updatedAt: Date
}

export interface OutfitRecommendation {
  id: string
  userId: string
  outfit: Outfit
  score: number
  reasons: string[]
  matchPercentage: number
  createdAt: Date
}

export interface OutfitFilter {
  occasion?: string[]
  budget?: {
    min: number
    max: number
  }
  sizes?: {
    top?: string
    bottom?: string
    shoes?: string
  }
  styles?: string[]
  colors?: string[]
  season?: string[]
  brands?: string[]
}
