import {
  DashboardStats,
  ManagedUser,
  UserManagementFilter,
  ContentReport,
  ModeratorAction,
  AnalyticsData,
} from '../entities/Admin'
import { PaginatedResponse } from './IOutfitRepository'

export interface IAdminRepository {
  getDashboardStats(): Promise<DashboardStats>
  getAnalytics(period: 'day' | 'week' | 'month' | 'year'): Promise<AnalyticsData>
  getUsers(filter: UserManagementFilter): Promise<PaginatedResponse<ManagedUser>>
  updateUserRole(userId: string, role: 'user' | 'admin' | 'moderator'): Promise<void>
  updateUserStatus(userId: string, status: 'active' | 'suspended' | 'banned'): Promise<void>
  getContentReports(page?: number, limit?: number): Promise<PaginatedResponse<ContentReport>>
  performModeratorAction(action: ModeratorAction): Promise<void>
  exportData(type: 'users' | 'content' | 'analytics', format: 'csv' | 'json'): Promise<Blob>
}
