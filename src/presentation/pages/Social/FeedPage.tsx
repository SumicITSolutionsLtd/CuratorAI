import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, TrendingUp, Sparkles } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import { PostCard } from '@/presentation/components/social/PostCard'
import { FeedFilters, SortOption } from '@/presentation/components/social/FeedFilters'
import { Button } from '@/presentation/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/presentation/components/ui/tabs'
import { Skeleton } from '@/presentation/components/ui/skeleton'
import { useAppSelector } from '@/shared/hooks/useAppSelector'
import { useAppDispatch } from '@/shared/hooks/useAppDispatch'
import { fetchFeed, setFeedType } from '@/shared/store/slices/socialSlice'

type FeedType = 'forYou' | 'following' | 'trending'

// Helper to format time ago
const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m`
  if (diffHours < 24) return `${diffHours}h`
  return `${diffDays}d`
}

export const FeedPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { feed, isLoading } = useAppSelector((state) => state.social)

  const [activeTab, setActiveTab] = useState<FeedType>('forYou')
  const [sortBy, setSortBy] = useState<SortOption>('recent')
  const [visibleCount, setVisibleCount] = useState(6)
  const [isLoadingMore, setIsLoadingMore] = useState(false)

  // Fetch feed on mount and when tab changes
  useEffect(() => {
    const feedType = activeTab === 'forYou' ? 'forYou' : activeTab === 'following' ? 'following' : 'trending'
    dispatch(setFeedType(feedType))
    dispatch(fetchFeed({ type: feedType, limit: 20, offset: 0 }))
  }, [dispatch, activeTab])

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value as FeedType)
    setVisibleCount(6) // Reset visible count
  }

  // Sort posts based on selected option
  const allPosts = useMemo(() => {
    const posts = [...feed]

    switch (sortBy) {
      case 'recent':
        return posts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      case 'popular':
        return posts.sort((a, b) => b.likes - a.likes)
      case 'trending':
        // Trending score based on engagement and recency
        return posts.sort((a, b) => {
          const aScore =
            (a.likes + a.comments * 2 + a.shares * 3) /
            Math.max(1, (Date.now() - new Date(a.createdAt).getTime()) / 3600000)
          const bScore =
            (b.likes + b.comments * 2 + b.shares * 3) /
            Math.max(1, (Date.now() - new Date(b.createdAt).getTime()) / 3600000)
          return bScore - aScore
        })
      default:
        return posts
    }
  }, [feed, sortBy])

  // Get visible posts
  const currentPosts = allPosts.slice(0, visibleCount)
  const hasMore = visibleCount < allPosts.length

  // Load more posts
  const loadMore = () => {
    if (isLoadingMore) return
    setIsLoadingMore(true)
    setTimeout(() => {
      setVisibleCount((prev) => prev + 6)
      setIsLoadingMore(false)
    }, 500)
  }

  // Infinite scroll
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY
      const scrollHeight = document.documentElement.scrollHeight
      const clientHeight = window.innerHeight

      // Load more when user is 200px from bottom
      if (
        scrollTop + clientHeight >= scrollHeight - 200 &&
        !isLoadingMore &&
        !isLoading &&
        visibleCount < allPosts.length
      ) {
        loadMore()
      }
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingMore, isLoading, visibleCount, allPosts.length])

  // Render post list
  const renderPosts = () => {
    if (isLoading && feed.length === 0) {
      return (
        <div className="mt-6 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-4 rounded-xl border bg-card p-4">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (currentPosts.length === 0) {
      const emptyMessages = {
        forYou: {
          title: 'No posts yet',
          description: 'Check back later for personalized content',
        },
        following: {
          title: 'No posts from following',
          description: 'Follow more users to see their posts here',
        },
        trending: {
          title: 'No trending posts',
          description: 'Check back later for trending content',
        },
      }

      const message = emptyMessages[activeTab]

      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="rounded-xl border bg-muted/30 p-16 text-center"
        >
          <Sparkles className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
          <p className="text-lg font-medium text-muted-foreground">{message.title}</p>
          <p className="mt-1 text-sm text-muted-foreground/70">{message.description}</p>
          {activeTab === 'following' && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => navigate('/discover')}
            >
              Discover Users
            </Button>
          )}
        </motion.div>
      )
    }

    return (
      <AnimatePresence mode="popLayout">
        <div className="space-y-6">
          {currentPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.05 }}
            >
              <PostCard
                id={post.id}
                author={{
                  name: post.author.fullName,
                  username: post.author.username,
                  avatar: post.author.photoUrl || '',
                }}
                images={post.images}
                caption={post.caption}
                tags={post.tags}
                likes={post.likes}
                comments={post.comments}
                timeAgo={formatTimeAgo(post.createdAt)}
                isLiked={post.isLiked}
                isSaved={post.isSaved}
              />
            </motion.div>
          ))}

          {/* Load More Indicator */}
          {isLoadingMore && (
            <div className="py-8 text-center">
              <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-brand-crimson border-t-transparent" />
                Loading more posts...
              </div>
            </div>
          )}

          {/* End of Feed */}
          {!hasMore && currentPosts.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-8 text-center text-sm text-muted-foreground"
            >
              You're all caught up! ✨
            </motion.div>
          )}
        </div>
      </AnimatePresence>
    )
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="font-montserrat text-2xl font-bold sm:text-3xl">Feed</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Discover the latest fashion inspiration
            </p>
          </div>
          <Button
            onClick={() => navigate('/posts/create')}
            className="bg-brand-crimson shadow-lg shadow-brand-crimson/25 hover:bg-brand-crimson/90"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Create Post</span>
            <span className="sm:hidden">Post</span>
          </Button>
        </motion.div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="forYou" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>For You</span>
            </TabsTrigger>
            <TabsTrigger value="following" className="flex items-center gap-2">
              <span>Following</span>
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>Trending</span>
            </TabsTrigger>
          </TabsList>

          {/* Filters */}
          {!isLoading && currentPosts.length > 0 && (
            <div className="mt-6">
              <FeedFilters sortBy={sortBy} onSortChange={setSortBy} />
            </div>
          )}

          {/* All Tabs Content */}
          <TabsContent value="forYou" className="mt-6">
            {renderPosts()}
          </TabsContent>

          <TabsContent value="following" className="mt-6">
            {renderPosts()}
          </TabsContent>

          <TabsContent value="trending" className="mt-6">
            {renderPosts()}
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
