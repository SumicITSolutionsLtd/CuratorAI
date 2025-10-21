export type NotificationType =
  | 'like'
  | 'comment'
  | 'follow'
  | 'recommendation'
  | 'sale'
  | 'system'
  | 'promo'

export interface Notification {
  id: string
  userId: string
  type: NotificationType
  title: string
  message: string
  imageUrl?: string
  actionUrl?: string
  actor?: {
    id: string
    username: string
    photoUrl?: string
  }
  isRead: boolean
  createdAt: Date
}

export interface NotificationPreferences {
  email: boolean
  push: boolean
  sms: boolean
  categories: {
    likes: boolean
    comments: boolean
    follows: boolean
    recommendations: boolean
    sales: boolean
    system: boolean
    promos: boolean
  }
}

export interface NotificationFilter {
  type?: NotificationType[]
  isRead?: boolean
  limit?: number
  offset?: number
}
