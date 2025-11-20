import { INotificationRepository } from '@domain/repositories/INotificationRepository'
import { Notification, NotificationFilter, NotificationPreferences } from '@domain/entities/Notification'
import { PaginatedResponse } from '@domain/repositories/IOutfitRepository'
import { apiClient } from '../api/ApiClient'

export class NotificationRepository implements INotificationRepository {
  async getNotifications(
    userId: string,
    filter?: NotificationFilter
  ): Promise<PaginatedResponse<Notification>> {
    const params: any = {}
    if (filter?.type) params.type = filter.type.join(',')
    if (filter?.isRead !== undefined) params.isRead = filter.isRead
    if (filter?.limit) params.limit = filter.limit
    if (filter?.offset) params.offset = filter.offset

    return apiClient.get<PaginatedResponse<Notification>>(`/notifications/${userId}`, { params })
  }

  async getUnreadCount(userId: string): Promise<number> {
    const response = await apiClient.get<{ count: number }>(`/notifications/${userId}/unread-count`)
    return response.count
  }

  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.put<void>(`/notifications/${notificationId}/read`)
  }

  async markAllAsRead(userId: string): Promise<void> {
    await apiClient.put<void>(`/notifications/${userId}/read-all`)
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete<void>(`/notifications/${notificationId}/delete`)
  }

  async getPreferences(userId: string): Promise<NotificationPreferences> {
    return apiClient.get<NotificationPreferences>(`/notifications/${userId}/preferences`)
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    return apiClient.put<NotificationPreferences>(`/notifications/${userId}/preferences`, preferences)
  }
}
