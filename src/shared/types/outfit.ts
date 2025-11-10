export interface OutfitItem {
  name: string
  price?: number
  brand?: string
}

export interface Outfit {
  id?: string | number
  name: string
  image?: string
  imageUrl?: string
  items: OutfitItem[]
  price?: number
  totalPrice?: number
  matchScore?: number
  tags?: string[]
  likes?: number
  isLiked?: boolean
  isSaved?: boolean
}
