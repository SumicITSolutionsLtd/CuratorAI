import { useState } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, UserCheck } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { cn } from '../../../shared/utils/cn'
import { showToast } from '../../../shared/utils/toast'

interface UserPreviewCardProps {
  userId: string
  username: string
  fullName: string
  photoUrl?: string
  bio?: string
  followers?: number
  following?: number
  posts?: number
  isFollowing?: boolean
  children: React.ReactNode
}

export const UserPreviewCard = ({
  username,
  fullName,
  photoUrl,
  bio = 'Fashion enthusiast | Style curator',
  followers = 0,
  following = 0,
  posts = 0,
  isFollowing: initialIsFollowing = false,
  children,
}: UserPreviewCardProps) => {
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing)
  const [isOpen, setIsOpen] = useState(false)

  const handleFollowToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsFollowing(!isFollowing)
    if (!isFollowing) {
      showToast.success(`Now following ${fullName}!`)
    } else {
      showToast.success(`Unfollowed ${fullName}`)
    }
  }

  return (
    <HoverCard open={isOpen} onOpenChange={setIsOpen} openDelay={300}>
      <HoverCardTrigger asChild>{children}</HoverCardTrigger>
      <HoverCardContent className="w-80" align="start" side="bottom" sideOffset={8}>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-14 w-14 ring-2 ring-brand-crimson/20">
                <AvatarImage src={photoUrl} />
                <AvatarFallback className="bg-brand-crimson/10 font-semibold text-brand-crimson">
                  {fullName[0]}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-base font-semibold leading-tight">{fullName}</p>
                <p className="text-sm text-muted-foreground">@{username}</p>
              </div>
            </div>

            <Button
              size="sm"
              variant={isFollowing ? 'outline' : 'default'}
              className={cn(
                !isFollowing && 'bg-brand-crimson text-white hover:bg-brand-crimson/90'
              )}
              onClick={handleFollowToggle}
            >
              {isFollowing ? (
                <>
                  <UserCheck className="mr-1.5 h-4 w-4" />
                  Following
                </>
              ) : (
                <>
                  <UserPlus className="mr-1.5 h-4 w-4" />
                  Follow
                </>
              )}
            </Button>
          </div>

          {/* Bio */}
          {bio && <p className="text-sm leading-relaxed text-foreground">{bio}</p>}

          {/* Stats */}
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="font-semibold text-foreground">{posts}</span>
              <span className="ml-1 text-muted-foreground">posts</span>
            </div>
            <div>
              <span className="font-semibold text-foreground">{followers.toLocaleString()}</span>
              <span className="ml-1 text-muted-foreground">followers</span>
            </div>
            <div>
              <span className="font-semibold text-foreground">{following.toLocaleString()}</span>
              <span className="ml-1 text-muted-foreground">following</span>
            </div>
          </div>

          {/* Sample Images */}
          <div className="grid grid-cols-3 gap-1 overflow-hidden rounded-lg">
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square animate-pulse bg-muted/50" />
            ))}
          </div>
        </motion.div>
      </HoverCardContent>
    </HoverCard>
  )
}
