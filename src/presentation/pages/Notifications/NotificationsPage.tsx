import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import {
  Heart,
  MessageCircle,
  UserPlus,
  ShoppingBag,
  Sparkles,
  Check,
  MoreHorizontal,
  Filter,
  Loader2,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Card } from '@/presentation/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/presentation/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs'
import { Badge } from '@/presentation/components/ui/badge'
import { cn } from '@/shared/utils/cn'
import { useAppSelector } from '@/shared/hooks/useAppSelector'
import { useAppDispatch } from '@/shared/hooks/useAppDispatch'
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from '@/shared/store/slices/notificationSlice'
import { showToast } from '@/shared/utils/toast'
import type { NotificationType } from '@/domain/entities/Notification'

// Helper to format time ago
const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'like':
      return <Heart className="h-5 w-5 text-brand-crimson" />
    case 'comment':
      return <MessageCircle className="h-5 w-5 text-brand-blue" />
    case 'follow':
      return <UserPlus className="h-5 w-5 text-brand-blue" />
    case 'recommendation':
      return <Sparkles className="h-5 w-5 text-brand-crimson" />
    default:
      return <ShoppingBag className="h-5 w-5 text-brand-blue" />
  }
}

export const NotificationsPage = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { notifications: notificationList, unreadCount, isLoading } = useAppSelector(
    (state) => state.notification
  )

  const [activeTab, setActiveTab] = useState<string>('all')

  // Fetch notifications and unread count on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchNotifications({ userId: user.id }))
      dispatch(fetchUnreadCount(user.id))
    }
  }, [dispatch, user?.id])

  // Mark notification as read
  const handleMarkAsRead = async (id: string) => {
    try {
      await dispatch(markNotificationAsRead(id)).unwrap()
    } catch (error: unknown) {
      showToast.error('Failed to mark as read', error.message)
    }
  }

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    if (!user?.id) return

    try {
      await dispatch(markAllNotificationsAsRead(user.id)).unwrap()
      showToast.success('All notifications marked as read')
    } catch (error: unknown) {
      showToast.error('Failed to mark all as read', error.message)
    }
  }

  // Delete notification
  const handleDeleteNotification = async (id: string) => {
    try {
      await dispatch(deleteNotification(id)).unwrap()
      showToast.success('Notification deleted')
    } catch (error: unknown) {
      showToast.error('Failed to delete notification', error.message)
    }
  }

  // Filter notifications based on active tab
  const filteredNotifications =
    activeTab === 'all'
      ? notificationList
      : activeTab === 'unread'
        ? notificationList.filter((n) => !n.isRead)
        : notificationList.filter((n) => n.type === activeTab as NotificationType)

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-3xl space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h1 className="font-heading text-2xl font-bold text-brand-charcoal sm:text-3xl">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
                You have {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0 || isLoading}
              className="flex-1 sm:flex-none"
            >
              <Check className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Mark all read</span>
              <span className="sm:hidden">Mark read</span>
            </Button>
            <Button variant="outline" size="icon" className="shrink-0">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger
              value="all"
              className="relative flex-col gap-1 px-2 py-3 lg:flex-row lg:gap-2 lg:px-4"
            >
              <span className="text-[10px] font-medium lg:text-sm">All</span>
              {unreadCount > 0 && (
                <Badge
                  variant="secondary"
                  className="absolute -right-1 -top-1 h-4 min-w-[16px] px-1 text-[9px] lg:relative lg:right-auto lg:top-auto lg:ml-1 lg:h-5 lg:min-w-[20px] lg:px-1.5 lg:text-xs"
                >
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger
              value="unread"
              className="flex-col gap-1 px-2 py-3 lg:flex-row lg:gap-2 lg:px-4"
            >
              <span className="text-[10px] font-medium lg:text-sm">Unread</span>
            </TabsTrigger>
            <TabsTrigger
              value="like"
              className="flex-col gap-1 px-2 py-3 lg:flex-row lg:gap-2 lg:px-4"
            >
              <Heart className="h-4 w-4" />
              <span className="text-[10px] font-medium lg:text-sm">Likes</span>
            </TabsTrigger>
            <TabsTrigger
              value="comment"
              className="flex-col gap-1 px-2 py-3 lg:flex-row lg:gap-2 lg:px-4"
            >
              <MessageCircle className="h-4 w-4" />
              <span className="text-[10px] font-medium lg:text-sm">Comments</span>
            </TabsTrigger>
            <TabsTrigger
              value="follow"
              className="flex-col gap-1 px-2 py-3 lg:flex-row lg:gap-2 lg:px-4"
            >
              <UserPlus className="h-4 w-4" />
              <span className="text-[10px] font-medium lg:text-sm">Follows</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6 space-y-2">
            {isLoading ? (
              <div className="flex min-h-[400px] items-center justify-center">
                <div className="text-center">
                  <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-brand-crimson" />
                  <p className="text-lg font-semibold">Loading notifications...</p>
                </div>
              </div>
            ) : filteredNotifications.length === 0 ? (
              <Card className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mx-auto max-w-sm space-y-3"
                >
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-crimson/10">
                    <Check className="h-8 w-8 text-brand-crimson" />
                  </div>
                  <h2 className="font-heading text-xl font-bold text-brand-charcoal">
                    You're all caught up!
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    No new notifications at the moment
                  </p>
                </motion.div>
              </Card>
            ) : (
              filteredNotifications.map((notification, index) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Card
                    className={cn(
                      'cursor-pointer p-4 transition-all hover:shadow-lg',
                      !notification.isRead && 'border-brand-crimson/20 bg-brand-crimson/5'
                    )}
                    onClick={() => handleMarkAsRead(notification.id)}
                  >
                    <div className="flex gap-4">
                      {/* Icon or Avatar */}
                      <div className="relative shrink-0">
                        {notification.actor ? (
                          <Avatar className="h-12 w-12 ring-2 ring-background">
                            <AvatarImage src={notification.actor.photoUrl} />
                            <AvatarFallback>{notification.actor.username[0]}</AvatarFallback>
                          </Avatar>
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-brand-crimson/20 to-brand-blue/20">
                            <Sparkles className="h-6 w-6 text-brand-crimson" />
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 rounded-full bg-background p-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-brand-charcoal">
                          {notification.actor && (
                            <span className="font-semibold">{notification.actor.username} </span>
                          )}
                          <span className="text-muted-foreground">{notification.message}</span>
                        </p>
                        {notification.title && (
                          <p className="mt-1 line-clamp-2 text-sm font-medium text-brand-charcoal">
                            {notification.title}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-muted-foreground">
                          {formatTimeAgo(notification.createdAt)}
                        </p>
                      </div>

                      {/* Image */}
                      {notification.imageUrl && (
                        <div className="shrink-0">
                          <img
                            src={notification.imageUrl}
                            alt=""
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        </div>
                      )}

                      {/* More Options / Delete */}
                      <div className="shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteNotification(notification.id)
                          }}
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Unread Indicator */}
                      {!notification.isRead && (
                        <div className="absolute right-4 top-4">
                          <div className="h-2 w-2 rounded-full bg-brand-crimson" />
                        </div>
                      )}
                    </div>

                    {/* Action Buttons for Follow Notifications */}
                    {notification.type === 'follow' && !notification.isRead && (
                      <div className="ml-16 mt-4 flex gap-2">
                        <Button size="sm" className="bg-brand-crimson hover:bg-brand-crimson/90">
                          Follow Back
                        </Button>
                        <Button size="sm" variant="outline">
                          View Profile
                        </Button>
                      </div>
                    )}
                  </Card>
                </motion.div>
              ))
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </MainLayout>
  )
}
