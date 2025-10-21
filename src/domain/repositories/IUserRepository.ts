import { User, UserPreferences, UserProfile } from '../entities/User'

export interface IUserRepository {
  getUserById(userId: string): Promise<User>
  updateProfile(userId: string, profile: Partial<UserProfile>): Promise<User>
  updatePreferences(userId: string, preferences: Partial<UserPreferences>): Promise<User>
  deleteUser(userId: string): Promise<void>
  searchUsers(query: string, limit?: number): Promise<User[]>
  followUser(userId: string, targetUserId: string): Promise<void>
  unfollowUser(userId: string, targetUserId: string): Promise<void>
  getFollowers(userId: string): Promise<User[]>
  getFollowing(userId: string): Promise<User[]>
}
