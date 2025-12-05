import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import {
  Plus,
  BookOpen,
  Heart,
  Eye,
  Bookmark,
  TrendingUp,
  Users,
  Calendar,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Badge } from '@/presentation/components/ui/badge'
import { Card } from '@/presentation/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/presentation/components/ui/avatar'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs'
import { Link, useNavigate } from 'react-router-dom'
import { useAppSelector } from '@/shared/hooks/useAppSelector'
import { useAppDispatch } from '@/shared/hooks/useAppDispatch'
import {
  fetchLookbooks,
  fetchFeaturedLookbooks,
  likeLookbook,
  unlikeLookbook,
} from '@/shared/store/slices/lookbookSlice'
import { useToast } from '@/presentation/components/ui/use-toast'
import { Lookbook } from '@/domain/entities/Lookbook'
import { LookbookGridSkeleton, StatsCardSkeleton } from '@/presentation/components/ui/shimmer'

// Format time ago
const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffDays < 1) return 'Today'
  if (diffDays < 7) return `${diffDays}d ago`
  if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
  return `${Math.floor(diffDays / 30)}mo ago`
}

export const LookbooksPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user } = useAppSelector((state) => state.auth)
  const { lookbooks, featuredLookbooks, isLoading, error } = useAppSelector(
    (state) => state.lookbook
  )

  const [activeTab, setActiveTab] = useState('trending')
  const [likedLookbooks, setLikedLookbooks] = useState<Set<string>>(new Set())

  // Fetch lookbooks on mount and tab change
  useEffect(() => {
    if (activeTab === 'trending') {
      dispatch(fetchFeaturedLookbooks(20))
    } else {
      dispatch(fetchLookbooks({ page: 1, limit: 20 }))
    }
  }, [dispatch, activeTab])

  // Show error toast
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      })
    }
  }, [error, toast])

  // Get active lookbooks based on tab
  const getActiveLookbooks = (): Lookbook[] => {
    if (activeTab === 'trending') {
      return featuredLookbooks
    }
    return lookbooks
  }

  const displayLookbooks = getActiveLookbooks()

  // Handle like/unlike
  const handleLike = async (e: React.MouseEvent, lookbookId: string) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user?.id) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to like lookbooks',
        variant: 'destructive',
      })
      return
    }

    const isLiked = likedLookbooks.has(lookbookId)

    try {
      if (isLiked) {
        await dispatch(unlikeLookbook({ userId: user.id, lookbookId })).unwrap()
        setLikedLookbooks((prev) => {
          const newSet = new Set(prev)
          newSet.delete(lookbookId)
          return newSet
        })
      } else {
        await dispatch(likeLookbook({ userId: user.id, lookbookId })).unwrap()
        setLikedLookbooks((prev) => new Set(prev).add(lookbookId))
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update like status',
        variant: 'destructive',
      })
    }
  }

  const handleCreateLookbook = () => {
    navigate('/lookbooks/create')
  }

  // Calculate stats
  const totalLikes = displayLookbooks.reduce((sum, lb) => sum + (lb.likes || 0), 0)
  const trendingCount = featuredLookbooks.length

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h1 className="font-heading text-2xl font-bold text-brand-charcoal sm:text-3xl">
              Lookbooks
            </h1>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Curated outfit collections from our fashion community
            </p>
          </div>
          <Button
            className="w-full bg-brand-crimson hover:bg-brand-crimson/90 sm:w-auto"
            onClick={handleCreateLookbook}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Lookbook
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          {isLoading && displayLookbooks.length === 0 ? (
            <>
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </>
          ) : (
            <>
              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card className="border-brand-crimson/20 p-4 transition-all hover:shadow-lg hover:shadow-brand-crimson/10">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-brand-crimson/10 p-3">
                      <BookOpen className="h-5 w-5 text-brand-crimson" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-brand-charcoal">
                        {displayLookbooks.length}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Lookbooks</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card className="border-brand-blue/20 p-4 transition-all hover:shadow-lg hover:shadow-brand-blue/10">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-brand-blue/10 p-3">
                      <Heart className="h-5 w-5 text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-brand-charcoal">
                        {totalLikes.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Likes</p>
                    </div>
                  </div>
                </Card>
              </motion.div>

              <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
                <Card className="border-brand-blue/20 p-4 transition-all hover:shadow-lg hover:shadow-brand-blue/10">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-brand-blue/10 p-3">
                      <TrendingUp className="h-5 w-5 text-brand-blue" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-brand-charcoal">{trendingCount}</p>
                      <p className="text-xs text-muted-foreground">Trending Now</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </>
          )}
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="trending" className="gap-1 sm:gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Trending</span>
            </TabsTrigger>
            <TabsTrigger value="following" className="gap-1 sm:gap-2">
              <Users className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Following</span>
            </TabsTrigger>
            <TabsTrigger value="saved" className="gap-1 sm:gap-2">
              <Bookmark className="h-4 w-4" />
              <span className="text-xs sm:text-sm">Saved</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="mt-6">
            {isLoading && displayLookbooks.length === 0 ? (
              <LookbookGridSkeleton count={6} />
            ) : displayLookbooks.length === 0 ? (
              <Card className="p-12 text-center">
                <motion.div
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mx-auto max-w-md space-y-4"
                >
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-crimson/10">
                    <BookOpen className="h-10 w-10 text-brand-crimson" />
                  </div>
                  <h2 className="font-heading text-2xl font-bold text-brand-charcoal">
                    No lookbooks yet
                  </h2>
                  <p className="text-muted-foreground">
                    {activeTab === 'saved'
                      ? 'Save lookbooks to see them here'
                      : activeTab === 'following'
                        ? 'Follow creators to see their lookbooks'
                        : 'Be the first to create a lookbook!'}
                  </p>
                  <Button
                    className="bg-brand-crimson hover:bg-brand-crimson/90"
                    onClick={handleCreateLookbook}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Create Lookbook
                  </Button>
                </motion.div>
              </Card>
            ) : (
              /* Lookbooks Grid */
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {displayLookbooks.map((lookbook, index) => (
                  <motion.div
                    key={lookbook.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Link to={`/lookbooks/${lookbook.id}`}>
                      <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-brand-crimson/20">
                        {/* Cover Image */}
                        <div className="relative aspect-[3/4] overflow-hidden bg-brand-beige">
                          <motion.img
                            src={lookbook.coverImage}
                            alt={lookbook.title}
                            className="h-full w-full object-cover"
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          />

                          {/* Overlay Gradient */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                          {/* Trending Badge */}
                          {lookbook.isFeatured && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.8 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="absolute left-3 top-3"
                            >
                              <Badge className="border-0 bg-brand-crimson text-white shadow-lg">
                                <Sparkles className="mr-1 h-3 w-3" />
                                Trending
                              </Badge>
                            </motion.div>
                          )}

                          {/* Quick Actions - Desktop (hover) */}
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            whileHover={{ opacity: 1, y: 0 }}
                            className="absolute right-3 top-3 hidden gap-2 lg:flex"
                          >
                            <Button
                              size="icon"
                              variant="secondary"
                              className={`h-8 w-8 rounded-full bg-white/90 hover:bg-white ${
                                likedLookbooks.has(lookbook.id) ? 'text-red-500' : ''
                              }`}
                              onClick={(e) => handleLike(e, lookbook.id)}
                            >
                              <Heart
                                className={`h-4 w-4 ${likedLookbooks.has(lookbook.id) ? 'fill-current' : ''}`}
                              />
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                toast({
                                  title: 'Saved!',
                                  description: 'Lookbook saved to your collection',
                                })
                              }}
                            >
                              <Bookmark className="h-4 w-4" />
                            </Button>
                          </motion.div>

                          {/* Quick Actions - Mobile (always visible) */}
                          <div className="absolute right-3 top-3 flex gap-2 lg:hidden">
                            <Button
                              size="icon"
                              variant="secondary"
                              className={`h-8 w-8 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white ${
                                likedLookbooks.has(lookbook.id) ? 'text-red-500' : ''
                              }`}
                              onClick={(e) => handleLike(e, lookbook.id)}
                            >
                              <Heart
                                className={`h-4 w-4 ${likedLookbooks.has(lookbook.id) ? 'fill-current' : ''}`}
                              />
                            </Button>
                            <Button
                              size="icon"
                              variant="secondary"
                              className="h-8 w-8 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white"
                              onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                toast({
                                  title: 'Saved!',
                                  description: 'Lookbook saved to your collection',
                                })
                              }}
                            >
                              <Bookmark className="h-4 w-4" />
                            </Button>
                          </div>

                          {/* Bottom Info Overlay */}
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <div className="flex items-center gap-2 text-xs text-white/90">
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                <span>{lookbook.views.toLocaleString()}</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                <span>{lookbook.likes.toLocaleString()}</span>
                              </div>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Bookmark className="h-3 w-3" />
                                <span>{lookbook.comments.toLocaleString()}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Lookbook Info */}
                        <div className="space-y-3 p-4">
                          <div>
                            <h3 className="font-heading line-clamp-1 font-bold text-brand-charcoal transition-colors group-hover:text-brand-crimson">
                              {lookbook.title}
                            </h3>
                            <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                              {lookbook.description}
                            </p>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6 ring-2 ring-brand-crimson/20">
                                <AvatarImage src={lookbook.creator?.photoUrl} />
                                <AvatarFallback>
                                  {lookbook.creator?.username?.[0] || 'U'}
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-medium text-brand-charcoal">
                                {lookbook.creator?.fullName || lookbook.creator?.username}
                              </span>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {lookbook.outfits?.length || 0} outfits
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            <span>{formatTimeAgo(lookbook.createdAt)}</span>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </motion.div>
    </MainLayout>
  )
}
