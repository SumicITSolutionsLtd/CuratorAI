import { useState, useCallback, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import {
  Search,
  Bell,
  MessageCircle,
  Heart,
  UserPlus,
  Sparkles,
  ArrowRight,
  Check,
  X,
  Loader2,
  MessageSquare,
} from 'lucide-react'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Logo } from '../common/Logo'
import { Separator } from '../ui/separator'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks'
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsAsRead,
} from '@/shared/store/slices/notificationSlice'
import { formatDistanceToNow } from 'date-fns'

export const TopBar = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [searchQuery, setSearchQuery] = useState('')

  const { user, isAuthenticated } = useAppSelector((state) => state.auth)
  const { notifications, unreadCount, isLoading } = useAppSelector((state) => state.notification)

  // Fetch notifications on mount and when user changes
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      dispatch(fetchNotifications({ userId: user.id, filter: { limit: 10 } }))
      dispatch(fetchUnreadCount(user.id))
    }
  }, [dispatch, isAuthenticated, user?.id])

  const handleMarkAllRead = useCallback(() => {
    if (user?.id) {
      dispatch(markAllNotificationsAsRead(user.id))
    }
  }, [dispatch, user?.id])

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart className="h-3 w-3 fill-brand-crimson text-brand-crimson" />
      case 'follow':
        return <UserPlus className="h-3 w-3 text-brand-blue" />
      case 'recommendation':
        return <Sparkles className="h-3 w-3 text-white" />
      default:
        return <Bell className="h-3 w-3 text-muted-foreground" />
    }
  }

  const getNotificationBgColor = (type: string, isRead: boolean) => {
    if (isRead) return ''
    switch (type) {
      case 'like':
        return 'bg-brand-crimson/5'
      case 'follow':
        return 'bg-brand-blue/5'
      case 'recommendation':
        return 'bg-gradient-to-r from-brand-crimson/5 to-brand-blue/5'
      default:
        return 'bg-muted/50'
    }
  }

  const handleSearch = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault()
      if (searchQuery.trim()) {
        // Navigate to visual search or outfits page with search query
        navigate(`/home?search=${encodeURIComponent(searchQuery.trim())}`)
      }
    },
    [searchQuery, navigate]
  )

  const handleClearSearch = useCallback(() => {
    setSearchQuery('')
  }, [])

  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-6"
    >
      {/* Logo - Responsive sizing */}
      <div className="flex flex-shrink-0 items-center">
        <Link to="/home" className="flex items-center">
          <Logo size="sm" className="scale-75 sm:scale-100" />
        </Link>
      </div>

      {/* Centered Search */}
      <div className="flex flex-1 items-center justify-center lg:px-4">
        <form onSubmit={handleSearch} className="relative w-full max-w-2xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search outfits, styles, brands..."
            className="pl-9 pr-9 focus-visible:ring-brand-blue"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </form>
      </div>

      {/* Actions */}
      <div className="flex flex-shrink-0 items-center gap-2">
        {/* Messages - Coming Soon (No backend API) */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative rounded-lg p-2 transition-colors hover:bg-muted"
            >
              <MessageCircle className="h-5 w-5" />
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[320px] p-0">
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h3 className="font-semibold text-brand-charcoal">Messages</h3>
                <p className="text-xs text-muted-foreground">Direct messaging</p>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <MessageSquare className="h-8 w-8 text-muted-foreground" />
              </div>
              <h4 className="font-semibold text-brand-charcoal">Coming Soon</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Direct messaging will be available in a future update. Stay tuned!
              </p>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative rounded-lg p-2 transition-colors hover:bg-muted"
            >
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -right-1 -top-1 h-5 min-w-[20px] animate-pulse bg-brand-crimson px-1.5">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[380px] p-0">
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h3 className="font-semibold text-brand-charcoal">Notifications</h3>
                <p className="text-xs text-muted-foreground">
                  {unreadCount > 0
                    ? `${unreadCount} new notification${unreadCount > 1 ? 's' : ''}`
                    : 'No new notifications'}
                </p>
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={handleMarkAllRead}
                >
                  <Check className="mr-1 h-3 w-3" />
                  Mark all read
                </Button>
              )}
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <Loader2 className="h-6 w-6 animate-spin text-brand-crimson" />
                </div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Bell className="mb-2 h-12 w-12 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">No notifications yet</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    We'll notify you when something happens
                  </p>
                </div>
              ) : (
                notifications.slice(0, 5).map((notification) => (
                  <motion.div
                    key={notification.id}
                    whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                    className={`relative flex cursor-pointer gap-3 border-b p-4 transition-colors ${getNotificationBgColor(notification.type, notification.isRead)} ${notification.isRead ? 'opacity-60' : ''}`}
                    onClick={() => notification.actionUrl && navigate(notification.actionUrl)}
                  >
                    {!notification.isRead && (
                      <div className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-brand-crimson" />
                    )}
                    <div className="relative ml-2">
                      {notification.actor ? (
                        <Avatar className="h-10 w-10 ring-2 ring-background">
                          <AvatarImage src={notification.actor.photoUrl} />
                          <AvatarFallback>
                            {notification.actor.username.slice(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                      ) : notification.type === 'recommendation' ? (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-crimson to-brand-blue">
                          <Sparkles className="h-5 w-5 text-white" />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                          <Bell className="h-5 w-5 text-muted-foreground" />
                        </div>
                      )}
                      {notification.actor && (
                        <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-1">
                          {getNotificationIcon(notification.type)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm">
                        {notification.actor && (
                          <span className="font-semibold text-brand-charcoal">
                            {notification.actor.username}
                          </span>
                        )}
                        <span className="text-muted-foreground"> {notification.message}</span>
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                      </p>
                    </div>
                    {notification.imageUrl && (
                      <img
                        src={notification.imageUrl}
                        alt=""
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    )}
                  </motion.div>
                ))
              )}
            </div>

            <Separator />
            <Link to="/notifications">
              <div className="p-3 text-center transition-colors hover:bg-muted">
                <Button variant="ghost" size="sm" className="w-full text-brand-blue">
                  View All Notifications
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}
