import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  Search,
  Shirt,
  Users,
  BookOpen,
  ShoppingCart,
  Settings,
  Camera,
  Bell,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  LogOut,
  User as UserIcon,
  Heart,
} from 'lucide-react'
import { cn } from '@/shared/utils/cn'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Badge } from '../ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip'
import { useAppSelector } from '@/shared/hooks/useAppSelector'
import { useAppDispatch } from '@/shared/hooks/useAppDispatch'
import { fetchCart } from '@/shared/store/slices/cartSlice'
import { logout } from '@/shared/store/slices/authSlice'
import { showToast } from '@/shared/utils/toast'

const baseNavItems = [
  { icon: Home, label: 'Home', path: '/home', primary: true },
  { icon: Search, label: 'Visual Search', path: '/search/visual', primary: true },
  { icon: Shirt, label: 'Wardrobe', path: '/wardrobe', primary: true },
  { icon: Users, label: 'Feed', path: '/feed', primary: true },
  { icon: ShoppingCart, label: 'Cart', path: '/cart', primary: true },
  { icon: BookOpen, label: 'Lookbooks', path: '/lookbooks', primary: false },
  { icon: Camera, label: 'Try-On', path: '/try-on', primary: false },
  { icon: Heart, label: 'Wishlist', path: '/wishlist', primary: false },
]

export const Sidebar = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)
  const { itemCount: cartItemCount } = useAppSelector((state) => state.cart)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const handleLogout = useCallback(async () => {
    try {
      await dispatch(logout()).unwrap()
      showToast.success('Logged out', 'You have been successfully logged out')
      navigate('/login')
    } catch {
      showToast.error('Logout failed', 'Please try again')
    }
  }, [dispatch, navigate])

  // Fetch cart on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchCart(user.id))
    }
  }, [dispatch, user?.id])

  // Load collapsed state from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('sidebar-collapsed')
    if (saved) {
      setIsCollapsed(JSON.parse(saved))
    }
  }, [])

  // Build nav items with dynamic cart badge
  const navItems = baseNavItems.map((item) => ({
    ...item,
    badge: item.path === '/cart' && cartItemCount > 0 ? cartItemCount : undefined,
  }))

  // Save collapsed state to localStorage
  const toggleCollapsed = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem('sidebar-collapsed', JSON.stringify(newState))
    // Dispatch custom event for same-tab updates
    window.dispatchEvent(new Event('sidebar-toggle'))
  }

  const primaryItems = navItems.filter((item) => item.primary)
  const secondaryItems = navItems.filter((item) => !item.primary)

  return (
    <>
      {/* Desktop Sidebar */}
      <motion.aside
        initial={{ x: -280 }}
        animate={{
          x: 0,
          width: isCollapsed ? '5rem' : '16rem',
        }}
        transition={{ duration: 0.3 }}
        className="fixed left-0 top-0 z-40 hidden h-screen border-r bg-background lg:block"
      >
        <div className="flex h-full flex-col">
          {/* User Profile */}
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="mt-4 border-b p-4"
            >
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12 ring-2 ring-brand-crimson/20">
                  <AvatarImage
                    src={
                      user?.profile?.photoUrl ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`
                    }
                  />
                  <AvatarFallback>
                    {user?.fullName
                      ?.split(' ')
                      .map((n) => n[0])
                      .join('')
                      .toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{user?.fullName || 'User'}</p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user?.profile?.bio || user?.role || 'Fashion Enthusiast'}
                  </p>
                </div>
                <button className="text-muted-foreground hover:text-foreground">
                  <Bell className="h-5 w-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Collapsed User Avatar */}
          {isCollapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 flex justify-center border-b p-4"
            >
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/profile/me">
                      <Avatar className="h-10 w-10 cursor-pointer ring-2 ring-brand-crimson/20">
                        <AvatarImage
                          src={
                            user?.profile?.photoUrl ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`
                          }
                        />
                        <AvatarFallback>
                          {user?.fullName
                            ?.split(' ')
                            .map((n) => n[0])
                            .join('')
                            .toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{user?.fullName || 'User'}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </motion.div>
          )}

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto p-4">
            <TooltipProvider>
              {navItems.map((item) => {
                const isActive = location.pathname === item.path
                const Icon = item.icon

                if (isCollapsed) {
                  return (
                    <Tooltip key={item.path}>
                      <TooltipTrigger asChild>
                        <Link to={item.path}>
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={cn(
                              'relative flex items-center justify-center rounded-lg p-3 transition-colors',
                              isActive
                                ? 'bg-brand-crimson text-white shadow-lg shadow-brand-crimson/30'
                                : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                            )}
                          >
                            <Icon className="h-5 w-5" />
                            {item.badge && (
                              <Badge
                                variant="secondary"
                                className="absolute -right-1 -top-1 h-5 min-w-[20px] px-1.5 text-xs"
                              >
                                {item.badge}
                              </Badge>
                            )}
                          </motion.div>
                        </Link>
                      </TooltipTrigger>
                      <TooltipContent side="right">
                        <p>{item.label}</p>
                      </TooltipContent>
                    </Tooltip>
                  )
                }

                return (
                  <Link key={item.path} to={item.path}>
                    <motion.div
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={cn(
                        'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'bg-brand-crimson text-white shadow-lg shadow-brand-crimson/30'
                          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                      )}
                    >
                      <Icon className="h-5 w-5 flex-shrink-0" />
                      <span className="flex-1 truncate">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="h-5 min-w-[20px] px-1.5">
                          {item.badge}
                        </Badge>
                      )}
                    </motion.div>
                  </Link>
                )
              })}
            </TooltipProvider>
          </nav>

          {/* Bottom Actions */}
          <div className="space-y-1 border-t p-4">
            <TooltipProvider>
              {isCollapsed ? (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Link to="/settings">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        className="flex items-center justify-center rounded-lg p-3 text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <Settings className="h-5 w-5" />
                      </motion.div>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>Settings</p>
                  </TooltipContent>
                </Tooltip>
              ) : (
                <Link to="/settings">
                  <motion.div
                    whileHover={{ x: 4 }}
                    className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
                  >
                    <Settings className="h-5 w-5 flex-shrink-0" />
                    <span className="truncate">Settings</span>
                  </motion.div>
                </Link>
              )}
            </TooltipProvider>

            {/* Toggle Button */}
            <button
              onClick={toggleCollapsed}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground',
                isCollapsed && 'justify-center'
              )}
            >
              {isCollapsed ? (
                <ChevronRight className="h-5 w-5" />
              ) : (
                <>
                  <ChevronLeft className="h-5 w-5 flex-shrink-0" />
                  <span className="truncate">Collapse</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Bottom Navigation */}
      <motion.nav
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:hidden"
      >
        <div className="flex items-center justify-around px-2 py-3">
          {primaryItems.slice(0, 4).map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon

            return (
              <Link key={item.path} to={item.path} className="relative">
                <motion.div
                  whileTap={{ scale: 0.9 }}
                  className={cn(
                    'flex flex-col items-center gap-1 rounded-lg px-4 py-2 transition-colors',
                    isActive ? 'text-brand-crimson' : 'text-muted-foreground'
                  )}
                >
                  <Icon className="h-6 w-6" />
                  <span className="text-xs font-medium">{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="absolute right-2 top-1 h-4 min-w-[16px] px-1 text-[10px]"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </motion.div>
              </Link>
            )
          })}

          {/* More Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex flex-col items-center gap-1 rounded-lg px-4 py-2 text-muted-foreground transition-colors hover:text-foreground">
                <MoreHorizontal className="h-6 w-6" />
                <span className="text-xs font-medium">More</span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuLabel>More Options</DropdownMenuLabel>
              <DropdownMenuSeparator />

              {/* Remaining primary items */}
              {primaryItems.slice(4).map((item) => {
                const Icon = item.icon
                return (
                  <DropdownMenuItem key={item.path} asChild>
                    <Link to={item.path} className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" className="ml-auto h-5 min-w-[20px] px-1.5">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  </DropdownMenuItem>
                )
              })}

              {/* Secondary items */}
              {secondaryItems.length > 0 && (
                <>
                  <DropdownMenuSeparator />
                  {secondaryItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <DropdownMenuItem key={item.path} asChild>
                        <Link to={item.path} className="flex items-center gap-3">
                          <Icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    )
                  })}
                </>
              )}

              <DropdownMenuSeparator />

              {/* Additional options */}
              <DropdownMenuItem asChild>
                <Link to="/profile/me" className="flex items-center gap-3">
                  <UserIcon className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem asChild>
                <Link to="/settings" className="flex items-center gap-3">
                  <Settings className="h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="flex cursor-pointer items-center gap-3 text-red-600"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.nav>
    </>
  )
}
