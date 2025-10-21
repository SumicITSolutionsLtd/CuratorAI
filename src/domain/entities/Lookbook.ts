export interface LookbookOutfit {
  id: string
  outfitId: string
  outfit: {
    name: string
    description: string
    images: string[]
    items: {
      id: string
      name: string
      brand: string
      price: number
      imageUrl: string
      productUrl?: string
    }[]
    totalPrice: number
  }
  order: number
}

export interface Lookbook {
  id: string
  creatorId: string
  creator: {
    id: string
    username: string
    fullName: string
    photoUrl?: string
  }
  title: string
  description: string
  coverImage: string
  outfits: LookbookOutfit[]
  priceRange: {
    min: number
    max: number
    currency: string
  }
  season?: string
  occasion?: string
  style?: string[]
  totalValue: number
  likes: number
  views: number
  comments: number
  isPublic: boolean
  isFeatured: boolean
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export interface LookbookFilter {
  season?: string[]
  occasion?: string[]
  priceRange?: {
    min: number
    max: number
  }
  style?: string[]
  featured?: boolean
}
