import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, Bell, MessageCircle } from 'lucide-react'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Logo } from '../common/Logo'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'

export const TopBar = () => {
  return (
    <motion.header
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 sm:px-6"
    >
      {/* Logo - Hidden on mobile */}
      <div className="hidden lg:flex items-center flex-shrink-0">
        <Link to="/home">
          <Logo size="sm" />
        </Link>
      </div>

      {/* Centered Search */}
      <div className="flex flex-1 items-center justify-center lg:px-4">
        <div className="relative w-full max-w-2xl">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search outfits, styles, brands..."
            className="pl-9 focus-visible:ring-brand-blue"
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {/* Messages */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative rounded-lg p-2 hover:bg-muted"
            >
              <MessageCircle className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 min-w-[20px] px-1.5">2</Badge>
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Messages</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">Emily Rodriguez</p>
                <p className="text-xs text-muted-foreground">Love your latest outfit! 💕</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="relative rounded-lg p-2 hover:bg-muted"
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -right-1 -top-1 h-5 min-w-[20px] px-1.5 bg-brand-crimson">
                5
              </Badge>
            </motion.button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <div className="flex flex-col gap-1">
                <p className="text-sm font-medium">New recommendations available!</p>
                <p className="text-xs text-muted-foreground">Based on your recent searches</p>
              </div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.header>
  )
}
