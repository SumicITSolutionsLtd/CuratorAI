export interface UserProfile {
  photoUrl?: string
  bio?: string
  location?: string
  website?: string
  socialLinks?: {
    instagram?: string
    twitter?: string
    facebook?: string
  }
}

export interface UserPreferences {
  styles: string[] // casual, formal, street, boho, minimal, vintage
  sizes: {
    top?: string
    bottom?: string
    shoes?: string
  }
  colors?: string[]
  budget: {
    min: number
    max: number
    currency: string
  }
  occasions?: string[]
}

export interface User {
  id: string
  email: string
  username: string
  fullName: string
  profile: UserProfile
  preferences: UserPreferences
  role: 'user' | 'admin' | 'moderator'
  isEmailVerified: boolean
  createdAt: Date
  updatedAt: Date
  // Social stats (populated when fetching user profiles)
  isFollowing?: boolean
  followersCount?: number
  followingCount?: number
  postsCount?: number
}

export interface AuthCredentials {
  email: string
  password: string
}

export interface RegisterData extends AuthCredentials {
  fullName: string
  username: string
  password2: string
  agreeToTerms: boolean
}

export interface OAuthProvider {
  provider: 'google' | 'facebook'
  token: string
}
