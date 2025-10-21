export interface BodyMeasurements {
  height: number
  heightUnit: 'cm' | 'in'
  shoulders: number
  chest: number
  waist: number
  hips: number
  inseam: number
  measurementUnit: 'cm' | 'in'
}

export interface BodyTracking {
  quality: 'poor' | 'good' | 'excellent'
  lighting: 'poor' | 'good' | 'excellent'
  distance: 'too_close' | 'too_far' | 'perfect'
  keypoints: {
    head: { x: number; y: number; confidence: number }
    shoulders: { x: number; y: number; confidence: number }
    chest: { x: number; y: number; confidence: number }
    waist: { x: number; y: number; confidence: number }
    hips: { x: number; y: number; confidence: number }
  }
}

export interface TryOnSession {
  id: string
  userId: string
  measurements?: BodyMeasurements
  currentItem?: {
    id: string
    name: string
    imageUrl: string
    category: string
  }
  tracking: BodyTracking
  capturedImages: string[]
  isActive: boolean
  createdAt: Date
}

export interface TryOnSettings {
  cameraEnabled: boolean
  frontCamera: boolean
  autoDetectBody: boolean
  showGuides: boolean
  enableRotation: boolean
  lightingAdjustment: boolean
}

export interface TryOnCalibration {
  step: number
  totalSteps: number
  instruction: string
  completed: boolean
  measurements: Partial<BodyMeasurements>
}
