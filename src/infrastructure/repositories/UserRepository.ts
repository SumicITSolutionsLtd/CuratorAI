import { IUserRepository } from '@domain/repositories/IUserRepository'
import { User, UserPreferences, UserProfile } from '@domain/entities/User'
import { apiClient } from '../api/ApiClient'

// Backend user profile type
interface BackendUserProfile {
  gender?: string
  date_of_birth?: string
  phone_number?: string
  country?: string
  city?: string
  timezone?: string
  body_type?: string
  height?: number
  weight?: number
  skin_tone?: string
  preferred_fit?: string
  location?: string
  website?: string
  social_links?: Record<string, string>
}

// Backend user type
interface BackendUser {
  id: number
  username: string
  email: string
  first_name?: string
  last_name?: string
  avatar?: string
  bio?: string
  is_verified?: boolean
  profile?: BackendUserProfile
  style_preference?: any
  followers_count?: string | number
  following_count?: string | number
  posts_count?: string | number
  is_following?: boolean
  created_at?: string
  updated_at?: string
}

// Transform backend user to frontend format
function transformUser(backend: BackendUser): User {
  return {
    id: backend.id.toString(),
    email: backend.email,
    username: backend.username,
    fullName: `${backend.first_name || ''} ${backend.last_name || ''}`.trim() || backend.username,
    profile: {
      photoUrl: backend.avatar || undefined,
      bio: backend.bio || undefined,
      location:
        backend.profile?.city && backend.profile?.country
          ? `${backend.profile.city}, ${backend.profile.country}`
          : backend.profile?.location || undefined,
      website: backend.profile?.website || undefined,
      socialLinks: backend.profile?.social_links || undefined,
    },
    preferences: backend.style_preference || {
      styles: [],
      sizes: {},
      budget: { min: 0, max: 1000, currency: 'USD' },
    },
    role: 'user',
    isEmailVerified: backend.is_verified || false,
    followersCount: parseInt(String(backend.followers_count || '0'), 10),
    followingCount: parseInt(String(backend.following_count || '0'), 10),
    postsCount: parseInt(String(backend.posts_count || '0'), 10),
    isFollowing: backend.is_following || false,
    createdAt: backend.created_at ? new Date(backend.created_at) : new Date(),
    updatedAt: backend.updated_at ? new Date(backend.updated_at) : new Date(),
  }
}

export class UserRepository implements IUserRepository {
  async getUserById(userId: string): Promise<User> {
    const response = await apiClient.get<{ success: boolean; data: BackendUser }>(
      `/auth/users/${userId}/`
    )
    const userData = response.data || response
    return transformUser(userData as BackendUser)
  }

  async updateProfile(_userId: string, profile: Partial<UserProfile>): Promise<User> {
    const payload: any = {}
    if (profile.bio !== undefined) payload.bio = profile.bio
    if (profile.photoUrl !== undefined) payload.avatar = profile.photoUrl
    if (profile.location !== undefined)
      payload.profile = { ...payload.profile, location: profile.location }
    if (profile.website !== undefined)
      payload.profile = { ...payload.profile, website: profile.website }

    const response = await apiClient.patch<{ success: boolean; data: BackendUser }>(
      '/auth/me/',
      payload
    )
    const userData = response.data || response
    return transformUser(userData as BackendUser)
  }

  async updatePreferences(_userId: string, preferences: Partial<UserPreferences>): Promise<User> {
    const response = await apiClient.patch<{ success: boolean; data: BackendUser }>('/auth/me/', {
      style_preference: preferences,
    })
    const userData = response.data || response
    return transformUser(userData as BackendUser)
  }

  async deleteUser(_userId: string): Promise<void> {
    await apiClient.delete<void>('/auth/delete/')
  }

  async searchUsers(query: string, limit?: number): Promise<User[]> {
    const response = await apiClient.get<{ success: boolean; data: { results: BackendUser[] } }>(
      '/auth/users/search/',
      { params: { search: query, limit } }
    )
    const results = response.data?.results || (response as any).results || []
    return results.map(transformUser)
  }

  async followUser(_userId: string, targetUserId: string): Promise<void> {
    await apiClient.post<void>(`/auth/users/${targetUserId}/follow/`)
  }

  async unfollowUser(_userId: string, targetUserId: string): Promise<void> {
    await apiClient.delete<void>(`/auth/users/${targetUserId}/follow/`)
  }

  async getFollowers(userId: string): Promise<User[]> {
    const response = await apiClient.get<{ success: boolean; data: { results: BackendUser[] } }>(
      `/auth/users/${userId}/followers/`
    )
    const results = response.data?.results || (response as any).results || []
    return results.map(transformUser)
  }

  async getFollowing(userId: string): Promise<User[]> {
    const response = await apiClient.get<{ success: boolean; data: { results: BackendUser[] } }>(
      `/auth/users/${userId}/following/`
    )
    const results = response.data?.results || (response as any).results || []
    return results.map(transformUser)
  }
}
