import { IUserRepository } from '@domain/repositories/IUserRepository'
import { User, UserPreferences, UserProfile } from '@domain/entities/User'
import { apiClient } from '../api/ApiClient'

export class UserRepository implements IUserRepository {
  async getUserById(userId: string): Promise<User> {
    return apiClient.get<User>(`/auth/users/${userId}`)
  }

  async updateProfile(_userId: string, profile: Partial<UserProfile>): Promise<User> {
    return apiClient.patch<User>('/auth/me', { profile })
  }

  async updatePreferences(_userId: string, preferences: Partial<UserPreferences>): Promise<User> {
    return apiClient.patch<User>('/auth/me', { preferences })
  }

  async deleteUser(_userId: string): Promise<void> {
    await apiClient.delete<void>('/auth/delete')
  }

  async searchUsers(query: string, limit?: number): Promise<User[]> {
    const response = await apiClient.get<{ results: User[] }>('/auth/users/search', {
      params: { search: query, limit },
    })
    return response.results
  }

  async followUser(_userId: string, targetUserId: string): Promise<void> {
    await apiClient.post<void>(`/auth/users/${targetUserId}/follow`)
  }

  async unfollowUser(_userId: string, targetUserId: string): Promise<void> {
    await apiClient.delete<void>(`/auth/users/${targetUserId}/follow`)
  }

  async getFollowers(userId: string): Promise<User[]> {
    const response = await apiClient.get<{ results: User[] }>(`/auth/users/${userId}/followers`)
    return response.results
  }

  async getFollowing(userId: string): Promise<User[]> {
    const response = await apiClient.get<{ results: User[] }>(`/auth/users/${userId}/following`)
    return response.results
  }
}
