import { useState } from 'react'
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
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Card } from '@/presentation/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/presentation/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs'
import { Badge } from '@/presentation/components/ui/badge'
import { cn } from '@/shared/utils/cn'

const notifications = [
  {
    id: 1,
    type: 'like',
    user: {
      name: 'Emma Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    },
    action: 'liked your outfit',
    target: 'Summer Brunch Look',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&h=100&fit=crop',
    timestamp: '2 minutes ago',
    read: false,
  },
  {
    id: 2,
    type: 'comment',
    user: {
      name: 'Alex Kim',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    action: 'commented on your post',
    target: '"Love this color combination! 😍"',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop',
    timestamp: '1 hour ago',
    read: false,
  },
  {
    id: 3,
    type: 'follow',
    user: {
      name: 'Maya Rodriguez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    },
    action: 'started following you',
    target: null,
    image: null,
    timestamp: '3 hours ago',
    read: false,
  },
  {
    id: 4,
    type: 'recommendation',
    user: null,
    action: 'New outfit recommendations',
    target: '5 new outfits curated for you',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=100&h=100&fit=crop',
    timestamp: '5 hours ago',
    read: true,
  },
  {
    id: 5,
    type: 'like',
    user: {
      name: 'Sophie Anderson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    },
    action: 'liked your lookbook',
    target: 'Fall Wardrobe Essentials',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=100&h=100&fit=crop',
    timestamp: '1 day ago',
    read: true,
  },
  {
    id: 6,
    type: 'follow',
    user: {
      name: 'James Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    },
    action: 'started following you',
    target: null,
    image: null,
    timestamp: '2 days ago',
    read: true,
  },
  {
    id: 7,
    type: 'comment',
    user: {
      name: 'Isabella Martinez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella',
    },
    action: 'commented on your post',
    target: '"Where did you get those shoes?"',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=100&h=100&fit=crop',
    timestamp: '3 days ago',
    read: true,
  },
]

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
  const [notificationList, setNotificationList] = useState(notifications)
  const [activeTab, setActiveTab] = useState('all')

  const unreadCount = notificationList.filter((n) => !n.read).length

  const markAsRead = (id: number) => {
    setNotificationList(notificationList.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotificationList(notificationList.map((n) => ({ ...n, read: true })))
  }

  const filteredNotifications =
    activeTab === 'all'
      ? notificationList
      : activeTab === 'unread'
        ? notificationList.filter((n) => !n.read)
        : notificationList.filter((n) => n.type === activeTab)

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-3xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-brand-charcoal">Notifications</h1>
            {unreadCount > 0 && (
              <p className="mt-1 text-sm text-muted-foreground">
                You have {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={markAllAsRead} disabled={unreadCount === 0}>
              <Check className="mr-2 h-4 w-4" />
              Mark all read
            </Button>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList>
            <TabsTrigger value="all">
              All
              {unreadCount > 0 && (
                <Badge variant="secondary" className="ml-2 px-1.5 py-0">
                  {unreadCount}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="like">
              <Heart className="mr-2 h-4 w-4" />
              Likes
            </TabsTrigger>
            <TabsTrigger value="comment">
              <MessageCircle className="mr-2 h-4 w-4" />
              Comments
            </TabsTrigger>
            <TabsTrigger value="follow">
              <UserPlus className="mr-2 h-4 w-4" />
              Follows
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6 space-y-2">
            {filteredNotifications.length === 0 ? (
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
                      !notification.read && 'border-brand-crimson/20 bg-brand-crimson/5'
                    )}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex gap-4">
                      {/* Icon or Avatar */}
                      <div className="relative shrink-0">
                        {notification.user ? (
                          <Avatar className="h-12 w-12 ring-2 ring-background">
                            <AvatarImage src={notification.user.avatar} />
                            <AvatarFallback>{notification.user.name[0]}</AvatarFallback>
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
                          {notification.user && (
                            <span className="font-semibold">{notification.user.name} </span>
                          )}
                          <span className="text-muted-foreground">{notification.action}</span>
                        </p>
                        {notification.target && (
                          <p className="mt-1 line-clamp-2 text-sm font-medium text-brand-charcoal">
                            {notification.target}
                          </p>
                        )}
                        <p className="mt-2 text-xs text-muted-foreground">
                          {notification.timestamp}
                        </p>
                      </div>

                      {/* Image */}
                      {notification.image && (
                        <div className="shrink-0">
                          <img
                            src={notification.image}
                            alt=""
                            className="h-16 w-16 rounded-lg object-cover"
                          />
                        </div>
                      )}

                      {/* More Options */}
                      <div className="shrink-0">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Unread Indicator */}
                      {!notification.read && (
                        <div className="absolute right-4 top-4">
                          <div className="h-2 w-2 rounded-full bg-brand-crimson" />
                        </div>
                      )}
                    </div>

                    {/* Action Buttons for Follow Notifications */}
                    {notification.type === 'follow' && !notification.read && (
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
