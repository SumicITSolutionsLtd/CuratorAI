export interface VisualSearchRequest {
  image: File | Blob
  similarityThreshold?: number
  removeDuplicates?: boolean
  filters?: {
    color?: string[]
    style?: string[]
    priceRange?: {
      min: number
      max: number
    }
    brand?: string[]
  }
}

export interface VisualSearchResultItem {
  id: string
  name: string
  price: number
  brand: string
  imageUrl: string
}

export interface VisualSearchResult {
  id: string
  similarityScore: number
  outfit?: {
    id: string
    name: string
    imageUrl: string
    items: VisualSearchResultItem[]
    totalPrice: number
  }
  product?: {
    id: string
    name: string
    price: number
    brand: string
    imageUrl: string
  }
}

export interface VisualSearchResponse {
  results: VisualSearchResult[]
  searchId?: string
}

export interface ImageProcessingStatus {
  status: 'processing' | 'completed' | 'failed'
  progress: number
}

// Text-based search types
export interface TextSearchRequest {
  query: string
  page?: number
  limit?: number
  filters?: {
    occasion?: string
    season?: string
  }
}

export interface TextSearchOutfitResult {
  id: string
  title: string
  description?: string
  mainImage: string
  totalPrice: number
  occasion?: string
  season?: string
  likesCount: number
  user?: {
    id: string
    username: string
    photoUrl?: string
  }
}

export interface TextSearchUserResult {
  id: string
  username: string
  fullName: string
  photoUrl?: string
  bio?: string
  followersCount: number
  isFollowing: boolean
}

export interface TextSearchResponse {
  outfits: TextSearchOutfitResult[]
  users: TextSearchUserResult[]
  totalOutfits: number
  totalUsers: number
}
