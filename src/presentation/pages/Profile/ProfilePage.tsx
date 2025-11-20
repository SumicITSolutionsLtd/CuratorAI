import { useState, useEffect } from 'react'
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
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Card } from '@/presentation/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/presentation/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs'
import { OutfitCard } from '@/presentation/components/outfit/OutfitCard'
import { Link } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'
import { useAppSelector } from '@/shared/hooks/useAppSelector'
import { useAppDispatch } from '@/shared/hooks/useAppDispatch'
import { fetchFeed } from '@/shared/store/slices/socialSlice'

// Format join date
const formatJoinDate = (date?: Date) => {
  if (!date) return 'Recently joined'
  return `Joined ${new Date(date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}`
}

const mockProfile = {
  name: 'Sarah Chen',
  username: '@sarahchen',
  bio: 'Fashion enthusiast • Style curator • Coffee lover ☕\nSharing my daily outfits and fashion finds',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
  coverImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1200&h=400&fit=crop',
  location: 'San Francisco, CA',
  website: 'sarahchen.style',
  joinedDate: 'Joined March 2023',
  stats: {
    posts: 127,
    followers: 12453,
    following: 892,
  },
  isFollowing: false,
  isOwnProfile: true,
}

const posts = [
  {
    id: 1,
    name: 'Summer Brunch',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
    items: [
      { name: 'Linen Dress', brand: 'Reformation' },
      { name: 'Sandals', brand: 'Ancient Greek' },
    ],
    matchScore: 95,
    price: 248,
    likes: 432,
  },
  {
    id: 2,
    name: 'Office Look',
    image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=600&h=800&fit=crop',
    items: [
      { name: 'Blazer', brand: 'Zara' },
      { name: 'Trousers', brand: 'COS' },
    ],
    matchScore: 92,
    price: 179,
    likes: 521,
  },
  {
    id: 3,
    name: 'Weekend Casual',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop',
    items: [
      { name: 'Denim Jacket', brand: "Levi's" },
      { name: 'White Tee', brand: 'Everlane' },
    ],
    matchScore: 88,
    price: 95,
    likes: 387,
  },
  {
    id: 4,
    name: 'Evening Elegance',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop',
    items: [
      { name: 'Silk Dress', brand: 'Reformation' },
      { name: 'Heels', brand: 'Stuart Weitzman' },
    ],
    matchScore: 94,
    price: 398,
    likes: 612,
  },
]

export const ProfilePage = () => {
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const [isFollowing, setIsFollowing] = useState(false)
  const [activeTab, setActiveTab] = useState('posts')

  // Fetch user's posts on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchFeed({ type: 'forYou', limit: 20, offset: 0 }))
    }
  }, [dispatch, user?.id])

  // Use current user data or fall back to mock
  const displayProfile = user
    ? {
        name: user.fullName || mockProfile.name,
        username: `@${user.username}` || mockProfile.username,
        bio: mockProfile.bio, // Bio not in User entity yet
        avatar: mockProfile.avatar, // photoUrl not in User entity yet
        coverImage: mockProfile.coverImage,
        location: mockProfile.location,
        website: mockProfile.website,
        joinedDate: formatJoinDate(user.createdAt),
        stats: mockProfile.stats, // Would come from backend in real app
        isFollowing: false,
        isOwnProfile: true,
      }
    : mockProfile

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
            <img src={displayProfile.coverImage} alt="Cover" className="h-full w-full object-cover" />
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
                      onClick={() => setIsFollowing(!isFollowing)}
                      className={cn(
                        'min-w-[120px]',
                        isFollowing
                          ? 'bg-muted text-foreground hover:bg-muted/80'
                          : 'bg-brand-crimson hover:bg-brand-crimson/90'
                      )}
                    >
                      {isFollowing ? (
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
              <p className="whitespace-pre-line text-sm text-brand-charcoal">{displayProfile.bio}</p>

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
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <OutfitCard {...post} />
                </motion.div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lookbooks" className="mt-6">
            <div className="py-12 text-center">
              <BookOpen className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground">No lookbooks yet</p>
            </div>
          </TabsContent>

          <TabsContent value="liked" className="mt-6">
            {displayProfile.isOwnProfile ? (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {posts.slice(0, 2).map((post, index) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <OutfitCard {...post} />
                  </motion.div>
                ))}
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
