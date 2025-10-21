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

export interface VisualSearchResult {
  id: string
  outfitId: string
  outfit: {
    name: string
    description?: string
    imageUrl: string
    items: {
      id: string
      name: string
      brand: string
      price: number
      currency: string
      imageUrl: string
    }[]
    totalPrice: number
  }
  similarityScore: number
  matchPercentage: number
  matchedFeatures: string[]
}

export interface VisualSearchResponse {
  query: {
    imageUrl: string
    timestamp: Date
  }
  results: VisualSearchResult[]
  totalResults: number
  processingTime: number
}

export interface ProcessingStep {
  step: number
  name: string
  status: 'pending' | 'in_progress' | 'completed' | 'failed'
  progress: number
}

export interface ImageProcessingStatus {
  id: string
  imageUrl: string
  steps: ProcessingStep[]
  currentStep: number
  totalSteps: number
  estimatedTimeRemaining: number
  status: 'processing' | 'completed' | 'failed'
}
