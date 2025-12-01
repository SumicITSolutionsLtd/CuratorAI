import { INotificationRepository } from '@domain/repositories/INotificationRepository'
import {
  Notification,
  NotificationFilter,
  NotificationPreferences,
} from '@domain/entities/Notification'
import { PaginatedResponse } from '@domain/repositories/IOutfitRepository'
import { apiClient } from '../api/ApiClient'

// Backend notification type
interface BackendNotification {
  id: number
  user_id: number
  type: string
  title: string
  message: string
  image_url?: string
  action_url?: string
  actor?: {
    id: number
    username: string
    avatar?: string
  }
  is_read: boolean
  read_at?: string
  created_at: string
}

// Transform backend notification to frontend format
function transformNotification(backend: BackendNotification): Notification {
  return {
    id: backend.id.toString(),
    userId: backend.user_id.toString(),
    type: backend.type as Notification['type'],
    title: backend.title,
    message: backend.message,
    imageUrl: backend.image_url,
    actionUrl: backend.action_url,
    actor: backend.actor
      ? {
          id: backend.actor.id.toString(),
          username: backend.actor.username,
          photoUrl: backend.actor.avatar,
        }
      : undefined,
    isRead: backend.is_read,
    createdAt: new Date(backend.created_at),
  }
}

export class NotificationRepository implements INotificationRepository {
  async getNotifications(
    userId: string,
    filter?: NotificationFilter
  ): Promise<PaginatedResponse<Notification>> {
    const params: any = {}
    if (filter?.type) params.type = filter.type.join(',')
    if (filter?.isRead !== undefined) params.is_read = filter.isRead
    if (filter?.limit) params.limit = filter.limit
    if (filter?.offset) params.offset = filter.offset

    const response = await apiClient.get<{
      count: number
      next?: string
      previous?: string
      results: BackendNotification[]
    }>(`/notifications/${userId}/`, { params })

    const limit = filter?.limit || 20
    const totalPages = Math.ceil(response.count / limit)

    return {
      results: response.results.map(transformNotification),
      count: response.count,
      currentPage: 1,
      totalPages,
      hasMore: !!response.next,
    }
  }

  async getUnreadCount(userId: string): Promise<number> {
    const response = await apiClient.get<{ success: boolean; data: { unread_count: number } }>(
      `/notifications/${userId}/unread-count/`
    )
    return response.data?.unread_count ?? response.data ?? 0
  }

  async markAsRead(notificationId: string): Promise<void> {
    await apiClient.post<void>(`/notifications/${notificationId}/read/`, {})
  }

  async markAllAsRead(userId: string): Promise<void> {
    await apiClient.post<void>(`/notifications/${userId}/read-all/`, {})
  }

  async deleteNotification(notificationId: string): Promise<void> {
    await apiClient.delete<void>(`/notifications/${notificationId}/delete/`)
  }

  async getPreferences(userId: string): Promise<NotificationPreferences> {
    const response = await apiClient.get<{ success: boolean; data: any }>(
      `/notifications/${userId}/preferences/`
    )
    const data = response.data || response
    return {
      email: data.email_notifications ?? true,
      push: data.push_notifications ?? true,
      sms: data.sms_notifications ?? false,
      categories: {
        likes: data.like_notifications ?? true,
        comments: data.comment_notifications ?? true,
        follows: data.follow_notifications ?? true,
        recommendations: data.recommendation_notifications ?? true,
        sales: data.sale_notifications ?? true,
        system: data.system_notifications ?? true,
        promos: data.promo_notifications ?? true,
      },
    }
  }

  async updatePreferences(
    userId: string,
    preferences: Partial<NotificationPreferences>
  ): Promise<NotificationPreferences> {
    const payload: any = {}
    if (preferences.email !== undefined) payload.email_notifications = preferences.email
    if (preferences.push !== undefined) payload.push_notifications = preferences.push
    if (preferences.sms !== undefined) payload.sms_notifications = preferences.sms
    if (preferences.categories) {
      if (preferences.categories.likes !== undefined)
        payload.like_notifications = preferences.categories.likes
      if (preferences.categories.comments !== undefined)
        payload.comment_notifications = preferences.categories.comments
      if (preferences.categories.follows !== undefined)
        payload.follow_notifications = preferences.categories.follows
      if (preferences.categories.recommendations !== undefined)
        payload.recommendation_notifications = preferences.categories.recommendations
      if (preferences.categories.sales !== undefined)
        payload.sale_notifications = preferences.categories.sales
      if (preferences.categories.system !== undefined)
        payload.system_notifications = preferences.categories.system
      if (preferences.categories.promos !== undefined)
        payload.promo_notifications = preferences.categories.promos
    }

    const response = await apiClient.put<{ success: boolean; data: any }>(
      `/notifications/${userId}/preferences/`,
      payload
    )
    const data = response.data || response
    return {
      email: data.email_notifications ?? true,
      push: data.push_notifications ?? true,
      sms: data.sms_notifications ?? false,
      categories: {
        likes: data.like_notifications ?? true,
        comments: data.comment_notifications ?? true,
        follows: data.follow_notifications ?? true,
        recommendations: data.recommendation_notifications ?? true,
        sales: data.sale_notifications ?? true,
        system: data.system_notifications ?? true,
        promos: data.promo_notifications ?? true,
      },
    }
  }
}
