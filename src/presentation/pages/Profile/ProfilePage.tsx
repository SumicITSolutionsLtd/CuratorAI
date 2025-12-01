import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import {
  Settings,
  Share2,
  MoreHorizontal,
  MapPin,
  Calendar,
  Link as LinkIcon,
  Grid3x3,
  BookOpen,
  Heart,
  MessageCircle,
  UserPlus,
  UserCheck,
  Loader2,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Card } from '@/presentation/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/presentation/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs'
import { OutfitCard } from '@/presentation/components/outfit/OutfitCard'
import { Link, useParams } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'
import { useAppSelector } from '@/shared/hooks/useAppSelector'
import { useAppDispatch } from '@/shared/hooks/useAppDispatch'
import { getUserById, followUser, unfollowUser } from '@/shared/store/slices/userSlice'
import { fetchUserOutfits } from '@/shared/store/slices/outfitSlice'
import { showToast } from '@/shared/utils/toast'

// Format join date
const formatJoinDate = (date?: Date) => {
  if (!date) return 'Recently joined'
  return `Joined ${new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
}

export const ProfilePage = () => {
  const { userId } = useParams<{ userId: string }>()
  const dispatch = useAppDispatch()
  const { user: currentUser } = useAppSelector((state) => state.auth)
  const { selectedUser, isLoading: userLoading } = useAppSelector((state) => state.user)
  const { userOutfits, isLoading: outfitsLoading } = useAppSelector((state) => state.outfit)

  const [activeTab, setActiveTab] = useState('posts')
  const [isFollowLoading, setIsFollowLoading] = useState(false)

  // Determine if viewing own profile or another user's profile
  const isOwnProfile = !userId || userId === 'me' || userId === currentUser?.id

  // The profile to display - either selected user or current user
  const profileUser = isOwnProfile ? currentUser : selectedUser

  // Fetch user profile and outfits on mount
  useEffect(() => {
    const targetUserId = isOwnProfile ? currentUser?.id : userId

    if (targetUserId && !isOwnProfile) {
      // Fetch other user's profile
      dispatch(getUserById(targetUserId))
    }

    if (targetUserId) {
      // Fetch user's outfits
      dispatch(fetchUserOutfits({ userId: targetUserId, page: 1, limit: 12 }))
    }
  }, [dispatch, userId, currentUser?.id, isOwnProfile])

  // Handle follow/unfollow
  const handleFollowToggle = useCallback(async () => {
    if (!currentUser?.id || !profileUser?.id) return

    setIsFollowLoading(true)
    try {
      if (profileUser.isFollowing) {
        await dispatch(
          unfollowUser({ userId: currentUser.id, targetUserId: profileUser.id })
        ).unwrap()
        showToast.success('Unfollowed', `You unfollowed ${profileUser.fullName}`)
      } else {
        await dispatch(
          followUser({ userId: currentUser.id, targetUserId: profileUser.id })
        ).unwrap()
        showToast.success('Following', `You are now following ${profileUser.fullName}`)
      }
    } catch (error: any) {
      showToast.error('Error', error?.message || 'Failed to update follow status')
    } finally {
      setIsFollowLoading(false)
    }
  }, [dispatch, currentUser?.id, profileUser])

  // Build display profile data
  const displayProfile = {
    name: profileUser?.fullName || 'User',
    username: `@${profileUser?.username || 'user'}`,
    bio: profileUser?.profile?.bio || 'No bio yet',
    avatar:
      profileUser?.profile?.photoUrl ||
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${profileUser?.username || 'user'}`,
    coverImage:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop',
    location: profileUser?.profile?.location,
    website: profileUser?.profile?.website,
    joinedDate: formatJoinDate(profileUser?.createdAt),
    stats: {
      posts: profileUser?.postsCount || userOutfits.length || 0,
      followers: profileUser?.followersCount || 0,
      following: profileUser?.followingCount || 0,
    },
    isFollowing: profileUser?.isFollowing || false,
    isOwnProfile,
  }

  // Show loading state
  if (userLoading && !isOwnProfile) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-brand-crimson" />
            <p className="text-lg font-medium">Loading profile...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Cover Image */}
        <Card className="overflow-hidden">
          <div className="relative h-48 bg-gradient-to-br from-brand-crimson/20 to-brand-blue/20 sm:h-64">
            <img
              src={displayProfile.coverImage}
              alt="Cover"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          </div>

          <div className="relative px-6 pb-6">
            {/* Avatar */}
            <div className="-mt-16 flex flex-col gap-4 sm:-mt-20 sm:flex-row sm:items-end sm:justify-between">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
                <Avatar className="h-32 w-32 shadow-xl ring-4 ring-background">
                  <AvatarImage src={displayProfile.avatar} />
                  <AvatarFallback className="text-2xl">{displayProfile.name[0]}</AvatarFallback>
                </Avatar>

                <div className="space-y-1 pb-2">
                  <h1 className="font-heading text-2xl font-bold text-brand-charcoal">
                    {displayProfile.name}
                  </h1>
                  <p className="text-sm text-muted-foreground">{displayProfile.username}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                {displayProfile.isOwnProfile ? (
                  <>
                    <Link to="/settings">
                      <Button variant="outline" className="w-full sm:w-auto">
                        <Settings className="mr-2 h-4 w-4" />
                        <span className="hidden sm:inline">Edit Profile</span>
                        <span className="sm:hidden">Edit</span>
                      </Button>
                    </Link>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      onClick={handleFollowToggle}
                      disabled={isFollowLoading}
                      className={cn(
                        'min-w-[120px]',
                        displayProfile.isFollowing
                          ? 'bg-muted text-foreground hover:bg-muted/80'
                          : 'bg-brand-crimson hover:bg-brand-crimson/90'
                      )}
                    >
                      {isFollowLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : displayProfile.isFollowing ? (
                        <>
                          <UserCheck className="mr-2 h-4 w-4" />
                          Following
                        </>
                      ) : (
                        <>
                          <UserPlus className="mr-2 h-4 w-4" />
                          Follow
                        </>
                      )}
                    </Button>
                    <Button variant="outline">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Message
                    </Button>
                    <Button variant="outline" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="mt-6 space-y-3">
              <p className="whitespace-pre-line text-sm text-brand-charcoal">
                {displayProfile.bio}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                {displayProfile.location && (
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{displayProfile.location}</span>
                  </div>
                )}
                {displayProfile.website && (
                  <div className="flex items-center gap-1">
                    <LinkIcon className="h-4 w-4" />
                    <a
                      href={`https://${displayProfile.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-brand-blue hover:underline"
                    >
                      {displayProfile.website}
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{displayProfile.joinedDate}</span>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-6 flex gap-6">
              <button className="group">
                <span className="font-bold text-brand-charcoal transition-colors group-hover:text-brand-crimson">
                  {displayProfile.stats.posts}
                </span>
                <span className="ml-1 text-sm text-muted-foreground">Posts</span>
              </button>
              <button className="group">
                <span className="font-bold text-brand-charcoal transition-colors group-hover:text-brand-crimson">
                  {displayProfile.stats.followers.toLocaleString()}
                </span>
                <span className="ml-1 text-sm text-muted-foreground">Followers</span>
              </button>
              <button className="group">
                <span className="font-bold text-brand-charcoal transition-colors group-hover:text-brand-crimson">
                  {displayProfile.stats.following}
                </span>
                <span className="ml-1 text-sm text-muted-foreground">Following</span>
              </button>
            </div>
          </div>
        </Card>

        {/* Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="posts" className="gap-1 sm:gap-2">
              <Grid3x3 className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Posts</span>
            </TabsTrigger>
            <TabsTrigger value="lookbooks" className="gap-1 sm:gap-2">
              <BookOpen className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Lookbooks</span>
            </TabsTrigger>
            <TabsTrigger value="liked" className="gap-1 sm:gap-2">
              <Heart className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Liked</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6">
            {outfitsLoading ? (
              <div className="flex min-h-[200px] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-brand-crimson" />
              </div>
            ) : userOutfits.length === 0 ? (
              <div className="py-12 text-center">
                <Sparkles className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">
                  {displayProfile.isOwnProfile
                    ? "You haven't posted any outfits yet"
                    : 'No outfits posted yet'}
                </p>
                {displayProfile.isOwnProfile && (
                  <Link to="/wardrobe/create-outfit">
                    <Button className="mt-4 bg-brand-crimson hover:bg-brand-crimson/90">
                      Create Your First Outfit
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {userOutfits.map((outfit, index) => (
                  <motion.div
                    key={outfit.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <OutfitCard
                      id={outfit.id}
                      name={outfit.name}
                      image={
                        outfit.mainImage || outfit.thumbnail || outfit.items?.[0]?.imageUrl || ''
                      }
                      items={
                        outfit.items?.map((item) => ({
                          name: item.name,
                          brand: item.brand,
                        })) || []
                      }
                      matchScore={outfit.confidenceScore || 0}
                      price={outfit.totalPrice || 0}
                      likes={outfit.likes || 0}
                    />
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="lookbooks" className="mt-6">
            <div className="py-12 text-center">
              <BookOpen className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No lookbooks yet</p>
            </div>
          </TabsContent>

          <TabsContent value="liked" className="mt-6">
            {displayProfile.isOwnProfile ? (
              <div className="py-12 text-center">
                <Heart className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">Your liked outfits will appear here</p>
                <Link to="/feed">
                  <Button variant="outline" className="mt-4">
                    Explore Outfits
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="py-12 text-center">
                <Heart className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">This user's liked posts are private</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </MainLayout>
  )
}
