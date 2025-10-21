import { Notification, NotificationFilter, NotificationPreferences } from '../entities/Notification'
import { PaginatedResponse } from './IOutfitRepository'

export interface INotificationRepository {
  getNotifications(userId: string, filter?: NotificationFilter): Promise<PaginatedResponse<Notification>>
  getUnreadCount(userId: string): Promise<number>
  markAsRead(notificationId: string): Promise<void>
  markAllAsRead(userId: string): Promise<void>
  deleteNotification(notificationId: string): Promise<void>
  getPreferences(userId: string): Promise<NotificationPreferences>
  updatePreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<NotificationPreferences>
}
