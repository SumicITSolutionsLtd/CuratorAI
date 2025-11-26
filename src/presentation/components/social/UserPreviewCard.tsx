import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { UserPlus, UserCheck, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '../ui/hover-card'
import { Skeleton } from '../ui/skeleton'
import { cn } from '../../../shared/utils/cn'
import { showToast } from '../../../shared/utils/toast'
import { UserRepository } from '@/infrastructure/repositories/UserRepository'
import { User } from '@domain/entities/User'

interface UserPreviewCardProps {
  userId: string
  username: string
  fullName: string
  photoUrl?: string
  children: React.ReactNode
}

const userRepository = new UserRepository()

export const UserPreviewCard = ({
  userId,
  username,
  fullName,
  photoUrl,
  children,
}: UserPreviewCardProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [userData, setUserData] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)

  // Fetch user data when hover card opens
  const fetchUserData = useCallback(async () => {
    if (!userId || userData) return

    setIsLoading(true)
    try {
      const user = await userRepository.getUserById(userId)
      setUserData(user)
      setIsFollowing(user.isFollowing || false)
    } catch {
      // User data fetch failed - show basic info only
    } finally {
      setIsLoading(false)
    }
  }, [userId, userData])

  useEffect(() => {
    if (isOpen && !userData && !isLoading) {
      fetchUserData()
    }
  }, [isOpen, userData, isLoading, fetchUserData])

  const handleFollowToggle = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isFollowLoading) return

    setIsFollowLoading(true)
    try {
      if (isFollowing) {
        await userRepository.unfollowUser('', userId)
        setIsFollowing(false)
        showToast.success(`Unfollowed ${fullName}`)
      } else {
        await userRepository.followUser('', userId)
        setIsFollowing(true)
        showToast.success(`Now following ${fullName}!`)
      }
    } catch {
      showToast.error('Failed to update follow status')
    } finally {
      setIsFollowLoading(false)
    }
  }

  const displayBio = userData?.profile?.bio || ''
  const displayFollowers = userData?.followersCount || 0
  const displayFollowing = userData?.followingCount || 0
  const displayPosts = userData?.postsCount || 0

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
                <AvatarImage src={photoUrl || userData?.profile?.photoUrl} />
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
              disabled={isFollowLoading}
            >
              {isFollowLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : isFollowing ? (
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
          {isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            displayBio && <p className="text-sm leading-relaxed text-foreground">{displayBio}</p>
          )}

          {/* Stats */}
          {isLoading ? (
            <div className="flex items-center gap-4">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          ) : (
            <div className="flex items-center gap-4 text-sm">
              <div>
                <span className="font-semibold text-foreground">{displayPosts}</span>
                <span className="ml-1 text-muted-foreground">posts</span>
              </div>
              <div>
                <span className="font-semibold text-foreground">
                  {displayFollowers.toLocaleString()}
                </span>
                <span className="ml-1 text-muted-foreground">followers</span>
              </div>
              <div>
                <span className="font-semibold text-foreground">
                  {displayFollowing.toLocaleString()}
                </span>
                <span className="ml-1 text-muted-foreground">following</span>
              </div>
            </div>
          )}
        </motion.div>
      </HoverCardContent>
    </HoverCard>
  )
}
