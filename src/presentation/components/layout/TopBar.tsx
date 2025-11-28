import { useState, useCallback } from 'react'
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
} from 'lucide-react'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Logo } from '../common/Logo'
import { Separator } from '../ui/separator'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'

export const TopBar = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')

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
        {/* Messages */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative rounded-lg p-2 transition-colors hover:bg-muted"
            >
              <MessageCircle className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 min-w-[20px] animate-pulse bg-brand-blue px-1.5">
                2
              </Badge>
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[380px] p-0">
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h3 className="font-semibold text-brand-charcoal">Messages</h3>
                <p className="text-xs text-muted-foreground">2 unread conversations</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                <Check className="mr-1 h-3 w-3" />
                Mark all read
              </Button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {/* Message 1 */}
              <Link to="/messages/1">
                <motion.div
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                  className="flex cursor-pointer gap-3 border-b p-4 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12 ring-2 ring-background">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emily" />
                      <AvatarFallback>ER</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background bg-green-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-brand-charcoal">Emily Rodriguez</p>
                      <span className="whitespace-nowrap text-xs text-muted-foreground">2m</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      Love your latest outfit! Where did you get that jacket? 💕
                    </p>
                    <Badge
                      className="mt-2 bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20"
                      variant="secondary"
                    >
                      New
                    </Badge>
                  </div>
                </motion.div>
              </Link>

              {/* Message 2 */}
              <Link to="/messages/2">
                <motion.div
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                  className="flex cursor-pointer gap-3 border-b p-4 transition-colors"
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12 ring-2 ring-background">
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" />
                      <AvatarFallback>AK</AvatarFallback>
                    </Avatar>
                    <div className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-background bg-green-500" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-brand-charcoal">Alex Kim</p>
                      <span className="whitespace-nowrap text-xs text-muted-foreground">1h</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      Thanks for the style tips! Really helped me out 🙌
                    </p>
                    <Badge
                      className="mt-2 bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20"
                      variant="secondary"
                    >
                      New
                    </Badge>
                  </div>
                </motion.div>
              </Link>

              {/* Message 3 - Read */}
              <Link to="/messages/3">
                <motion.div
                  whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                  className="flex cursor-pointer gap-3 p-4 opacity-60 transition-colors"
                >
                  <Avatar className="h-12 w-12 ring-2 ring-background">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maya" />
                    <AvatarFallback>MR</AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-semibold text-brand-charcoal">Maya Rodriguez</p>
                      <span className="whitespace-nowrap text-xs text-muted-foreground">3h</span>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      Perfect! See you at the event tomorrow
                    </p>
                  </div>
                </motion.div>
              </Link>
            </div>

            <Separator />
            <Link to="/messages">
              <div className="p-3 text-center transition-colors hover:bg-muted">
                <Button variant="ghost" size="sm" className="w-full text-brand-blue">
                  View All Messages
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Link>
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
              <Badge className="absolute -right-1 -top-1 h-5 min-w-[20px] animate-pulse bg-brand-crimson px-1.5">
                5
              </Badge>
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[380px] p-0">
            <div className="flex items-center justify-between border-b p-4">
              <div>
                <h3 className="font-semibold text-brand-charcoal">Notifications</h3>
                <p className="text-xs text-muted-foreground">5 new notifications</p>
              </div>
              <Button variant="ghost" size="sm" className="h-8 text-xs">
                <Check className="mr-1 h-3 w-3" />
                Mark all read
              </Button>
            </div>

            <div className="max-h-[400px] overflow-y-auto">
              {/* Notification 1 - Like */}
              <motion.div
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                className="relative flex cursor-pointer gap-3 border-b bg-brand-crimson/5 p-4 transition-colors"
              >
                <div className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-brand-crimson" />
                <div className="relative ml-2">
                  <Avatar className="h-10 w-10 ring-2 ring-background">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Emma" />
                    <AvatarFallback>EW</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-1">
                    <Heart className="h-3 w-3 fill-brand-crimson text-brand-crimson" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-semibold text-brand-charcoal">Emma Wilson</span>
                    <span className="text-muted-foreground"> liked your outfit </span>
                    <span className="font-medium text-brand-charcoal">"Summer Brunch Look"</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">2 minutes ago</p>
                </div>
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&h=100&fit=crop"
                  alt=""
                  className="h-12 w-12 rounded-lg object-cover"
                />
              </motion.div>

              {/* Notification 2 - Follow */}
              <motion.div
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                className="relative flex cursor-pointer gap-3 border-b bg-brand-blue/5 p-4 transition-colors"
              >
                <div className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-brand-blue" />
                <div className="relative ml-2">
                  <Avatar className="h-10 w-10 ring-2 ring-background">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Maya" />
                    <AvatarFallback>MR</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-1">
                    <UserPlus className="h-3 w-3 text-brand-blue" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-semibold text-brand-charcoal">Maya Rodriguez</span>
                    <span className="text-muted-foreground"> started following you</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">1 hour ago</p>
                  <div className="mt-2 flex gap-2">
                    <Button
                      size="sm"
                      className="h-7 bg-brand-crimson text-xs hover:bg-brand-crimson/90"
                    >
                      Follow Back
                    </Button>
                    <Button size="sm" variant="outline" className="h-7 text-xs">
                      View Profile
                    </Button>
                  </div>
                </div>
              </motion.div>

              {/* Notification 3 - Recommendation */}
              <motion.div
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                className="relative flex cursor-pointer gap-3 border-b bg-gradient-to-r from-brand-crimson/5 to-brand-blue/5 p-4 transition-colors"
              >
                <div className="absolute left-2 top-1/2 h-2 w-2 -translate-y-1/2 rounded-full bg-gradient-to-r from-brand-crimson to-brand-blue" />
                <div className="relative ml-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-brand-crimson to-brand-blue">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-semibold text-brand-charcoal">New Recommendations</span>
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    5 new outfits curated just for you
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </motion.div>

              {/* Read notification */}
              <motion.div
                whileHover={{ backgroundColor: 'rgba(0,0,0,0.02)' }}
                className="flex cursor-pointer gap-3 border-b p-4 opacity-60 transition-colors"
              >
                <div className="relative">
                  <Avatar className="h-10 w-10 ring-2 ring-background">
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie" />
                    <AvatarFallback>SA</AvatarFallback>
                  </Avatar>
                  <div className="absolute -bottom-1 -right-1 rounded-full bg-white p-1">
                    <Heart className="h-3 w-3 text-brand-crimson" />
                  </div>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-semibold text-brand-charcoal">Sophie Anderson</span>
                    <span className="text-muted-foreground"> liked your lookbook</span>
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">1 day ago</p>
                </div>
              </motion.div>
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
