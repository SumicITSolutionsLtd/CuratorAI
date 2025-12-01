import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  Calendar,
  ArrowLeft,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Card } from '@/presentation/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/presentation/components/ui/avatar'
import { Badge } from '@/presentation/components/ui/badge'
import { Separator } from '@/presentation/components/ui/separator'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'
import { useAppDispatch } from '@/shared/hooks/useAppDispatch'
import { useAppSelector } from '@/shared/hooks/useAppSelector'
import {
  fetchPostById,
  fetchComments,
  likePost,
  unlikePost,
  savePost,
  unsavePost,
  sharePost,
  addComment,
  likeComment,
  unlikeComment,
  clearSelectedPost,
  optimisticLikePost,
  optimisticUnlikePost,
  optimisticSavePost,
  optimisticUnsavePost,
  rollbackLikePost,
  rollbackUnlikePost,
  rollbackSavePost,
  rollbackUnsavePost,
} from '@/shared/store/slices/socialSlice'
import { followUser, unfollowUser } from '@/shared/store/slices/userSlice'
import { showToast } from '@/shared/utils/toast'
import { DetailPageSkeleton, Shimmer } from '@/presentation/components/ui/shimmer'

// Helper function to format relative time
const formatRelativeTime = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffSeconds = Math.floor(diffMs / 1000)
  const diffMinutes = Math.floor(diffSeconds / 60)
  const diffHours = Math.floor(diffMinutes / 60)
  const diffDays = Math.floor(diffHours / 24)

  if (diffSeconds < 60) return 'Just now'
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
  if (diffDays < 30)
    return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`
  return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) !== 1 ? 's' : ''} ago`
}

export const PostDetailPage = () => {
  const { postId } = useParams<{ postId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()

  const { user } = useAppSelector((state) => state.auth)
  const {
    selectedPost: post,
    comments,
    isLoading,
    isPostActionLoading,
    error,
  } = useAppSelector((state) => state.social)

  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [commentInput, setCommentInput] = useState('')
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)

  // Fetch post and comments on mount
  useEffect(() => {
    if (postId) {
      dispatch(fetchPostById(postId))
      dispatch(fetchComments({ postId }))
    }

    // Cleanup on unmount
    return () => {
      dispatch(clearSelectedPost())
    }
  }, [dispatch, postId])

  // Show error toast
  useEffect(() => {
    if (error) {
      showToast.error('Error', error)
    }
  }, [error])

  const nextImage = () => {
    if (!post) return
    setCurrentImageIndex((prev) => (prev === post.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    if (!post) return
    setCurrentImageIndex((prev) => (prev === 0 ? post.images.length - 1 : prev - 1))
  }

  const handleLikePost = async () => {
    if (!post || !user?.id) {
      showToast.error('Please log in', 'You need to be logged in to like posts')
      return
    }

    if (post.isLiked) {
      // Optimistic update
      dispatch(optimisticUnlikePost(post.id))
      try {
        await dispatch(unlikePost({ postId: post.id })).unwrap()
      } catch {
        // Rollback on failure
        dispatch(rollbackUnlikePost(post.id))
        showToast.error('Error', 'Failed to unlike post')
      }
    } else {
      // Optimistic update
      dispatch(optimisticLikePost(post.id))
      try {
        await dispatch(likePost({ postId: post.id })).unwrap()
      } catch {
        // Rollback on failure
        dispatch(rollbackLikePost(post.id))
        showToast.error('Error', 'Failed to like post')
      }
    }
  }

  const handleSavePost = async () => {
    if (!post || !user?.id) {
      showToast.error('Please log in', 'You need to be logged in to save posts')
      return
    }

    if (post.isSaved) {
      // Optimistic update
      dispatch(optimisticUnsavePost(post.id))
      try {
        await dispatch(unsavePost({ postId: post.id })).unwrap()
        showToast.success('Removed from saved', 'Post has been removed from your saved items')
      } catch {
        // Rollback on failure
        dispatch(rollbackUnsavePost(post.id))
        showToast.error('Error', 'Failed to unsave post')
      }
    } else {
      // Optimistic update
      dispatch(optimisticSavePost(post.id))
      try {
        await dispatch(savePost({ postId: post.id })).unwrap()
        showToast.success('Saved', 'Post has been saved to your collection')
      } catch {
        // Rollback on failure
        dispatch(rollbackSavePost(post.id))
        showToast.error('Error', 'Failed to save post')
      }
    }
  }

  const handleSharePost = async () => {
    if (!post || !user?.id) {
      showToast.error('Please log in', 'You need to be logged in to share posts')
      return
    }

    try {
      await dispatch(sharePost({ postId: post.id })).unwrap()
      showToast.success('Shared', 'Post has been shared')
    } catch {
      showToast.error('Error', 'Failed to share post')
    }
  }

  const handleAddComment = async () => {
    if (!post || !user?.id) {
      showToast.error('Please log in', 'You need to be logged in to comment')
      return
    }

    if (!commentInput.trim()) return

    try {
      await dispatch(addComment({ postId: post.id, content: commentInput.trim() })).unwrap()
      setCommentInput('')
      showToast.success('Comment added', 'Your comment has been posted')
    } catch {
      showToast.error('Error', 'Failed to add comment')
    }
  }

  const handleLikeComment = async (commentId: string, isCurrentlyLiked: boolean) => {
    if (!user?.id) {
      showToast.error('Please log in', 'You need to be logged in to like comments')
      return
    }

    try {
      if (isCurrentlyLiked) {
        await dispatch(unlikeComment({ commentId })).unwrap()
      } else {
        await dispatch(likeComment({ commentId })).unwrap()
      }
    } catch {
      showToast.error('Error', 'Failed to update comment like')
    }
  }

  const handleFollowUser = async () => {
    if (!post || !user?.id) {
      showToast.error('Please log in', 'You need to be logged in to follow users')
      return
    }

    // Can't follow yourself
    if (post.author.id === user.id) {
      return
    }

    setIsFollowLoading(true)
    try {
      if (isFollowing) {
        await dispatch(unfollowUser({ userId: user.id, targetUserId: post.author.id })).unwrap()
        setIsFollowing(false)
        showToast.success('Unfollowed', `You unfollowed ${post.author.fullName}`)
      } else {
        await dispatch(followUser({ userId: user.id, targetUserId: post.author.id })).unwrap()
        setIsFollowing(true)
        showToast.success('Following', `You are now following ${post.author.fullName}`)
      }
    } catch {
      showToast.error('Error', isFollowing ? 'Failed to unfollow user' : 'Failed to follow user')
    } finally {
      setIsFollowLoading(false)
    }
  }

  // Loading state
  if (isLoading && !post) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-6xl space-y-6">
          <Shimmer className="h-10 w-20" />
          <DetailPageSkeleton />
        </div>
      </MainLayout>
    )
  }

  // Not found state
  if (!isLoading && !post) {
    return (
      <MainLayout>
        <div className="flex h-96 flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-muted-foreground">Post Not Found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The post you're looking for doesn't exist or has been deleted.
          </p>
          <Button onClick={() => navigate('/feed')} className="mt-6">
            Back to Feed
          </Button>
        </div>
      </MainLayout>
    )
  }

  if (!post) return null

  const isOwnPost = user?.id === post.author.id

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-6xl space-y-6"
      >
        {/* Back Button */}
        <Button variant="ghost" className="gap-2" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Image Section */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              {/* Image Carousel */}
              <div className="relative aspect-[4/5] bg-brand-charcoal">
                {post.images.length > 0 ? (
                  <img
                    src={post.images[currentImageIndex]}
                    alt={`Post ${currentImageIndex + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-brand-beige">
                    <ShoppingBag className="h-20 w-20 text-muted-foreground" />
                  </div>
                )}

                {/* Image Navigation */}
                {post.images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-colors hover:bg-white"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg transition-colors hover:bg-white"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>

                    {/* Image Indicators */}
                    <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                      {post.images.map((_, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={cn(
                            'h-2 rounded-full transition-all',
                            index === currentImageIndex ? 'w-8 bg-white' : 'w-2 bg-white/50'
                          )}
                        />
                      ))}
                    </div>
                  </>
                )}

                {/* Quick Actions */}
                {post.images.length > 1 && (
                  <div className="absolute right-4 top-4 flex gap-2">
                    <Badge className="bg-white/90 text-brand-charcoal hover:bg-white">
                      {currentImageIndex + 1} / {post.images.length}
                    </Badge>
                  </div>
                )}
              </div>

              {/* Action Bar */}
              <div className="border-t p-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={handleLikePost}
                      className="group flex items-center gap-2"
                    >
                      <Heart
                        className={cn(
                          'h-6 w-6 transition-colors',
                          post.isLiked
                            ? 'fill-brand-crimson text-brand-crimson'
                            : 'text-muted-foreground group-hover:text-brand-crimson'
                        )}
                      />
                      <span className="text-sm font-medium">{post.likes.toLocaleString()}</span>
                    </motion.button>

                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                      <MessageCircle className="h-6 w-6" />
                      <span className="text-sm font-medium">{post.comments}</span>
                    </button>

                    <button
                      onClick={handleSharePost}
                      className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
                    >
                      <Share2 className="h-6 w-6" />
                      <span className="text-sm font-medium">{post.shares}</span>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={handleSavePost}>
                      <Bookmark
                        className={cn(
                          'h-6 w-6 transition-colors',
                          post.isSaved
                            ? 'fill-brand-blue text-brand-blue'
                            : 'text-muted-foreground hover:text-brand-blue'
                        )}
                      />
                    </motion.button>
                    <button className="text-muted-foreground hover:text-foreground">
                      <MoreHorizontal className="h-6 w-6" />
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Details Sidebar */}
          <div className="space-y-4 lg:col-span-1">
            <div className="sticky top-6 space-y-4">
              {/* Author Card */}
              <Card className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Link to={`/profile/${post.author.id}`}>
                      <Avatar className="h-12 w-12 ring-2 ring-brand-crimson/20">
                        <AvatarImage src={post.author.photoUrl} />
                        <AvatarFallback>
                          {post.author.fullName?.[0] || post.author.username?.[0] || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </Link>
                    <div>
                      <Link to={`/profile/${post.author.id}`}>
                        <p className="font-semibold text-brand-charcoal transition-colors hover:text-brand-crimson">
                          {post.author.fullName || post.author.username}
                        </p>
                      </Link>
                      <p className="text-xs text-muted-foreground">@{post.author.username}</p>
                    </div>
                  </div>
                  {!isOwnPost && (
                    <Button
                      onClick={handleFollowUser}
                      disabled={isFollowLoading}
                      variant={isFollowing ? 'outline' : 'default'}
                      className={isFollowing ? '' : 'bg-brand-crimson hover:bg-brand-crimson/90'}
                    >
                      {isFollowLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isFollowing ? (
                        'Following'
                      ) : (
                        'Follow'
                      )}
                    </Button>
                  )}
                </div>

                <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {formatRelativeTime(post.createdAt)}
                  </div>
                  {post.privacy !== 'public' && (
                    <>
                      <span>•</span>
                      <Badge variant="outline" className="text-xs">
                        {post.privacy}
                      </Badge>
                    </>
                  )}
                </div>
              </Card>

              {/* Caption */}
              <Card className="p-4">
                <p className="whitespace-pre-line text-sm text-brand-charcoal">{post.caption}</p>
                {post.tags && post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="outline"
                        className="border-brand-crimson/30 text-brand-crimson hover:bg-brand-crimson/10"
                      >
                        {tag.startsWith('#') ? tag : `#${tag}`}
                      </Badge>
                    ))}
                  </div>
                )}
              </Card>

              {/* Tagged Items (if available) */}
              {post.taggedItems && post.taggedItems.length > 0 && (
                <Card className="p-4">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-brand-charcoal">Tagged Items</h3>
                    <ShoppingBag className="h-5 w-5 text-brand-crimson" />
                  </div>
                  <div className="space-y-3">
                    {post.taggedItems.map((item, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted"
                      >
                        <p className="text-sm text-brand-charcoal">{item}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Outfit Link (if available) */}
              {post.outfitId && (
                <Card className="p-4">
                  <Link
                    to={`/outfit/${post.outfitId}`}
                    className="flex items-center justify-between text-sm font-medium text-brand-blue hover:underline"
                  >
                    <span>View Full Outfit</span>
                    <ShoppingBag className="h-4 w-4" />
                  </Link>
                </Card>
              )}

              {/* Comments */}
              <Card className="p-4">
                <h3 className="mb-4 font-semibold text-brand-charcoal">
                  Comments ({comments.length})
                </h3>

                {/* Comment Input */}
                <div className="mb-4 flex gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profile?.photoUrl} />
                    <AvatarFallback>
                      {user?.fullName?.[0] || user?.username?.[0] || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-1 gap-2">
                    <Input
                      placeholder="Add a comment..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
                      disabled={isPostActionLoading}
                    />
                    <Button
                      size="icon"
                      onClick={handleAddComment}
                      disabled={!commentInput.trim() || isPostActionLoading}
                      className="bg-brand-crimson hover:bg-brand-crimson/90"
                    >
                      {isPostActionLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                <Separator className="my-4" />

                {/* Comments List */}
                <div className="max-h-[400px] space-y-4 overflow-y-auto">
                  {comments.length === 0 ? (
                    <p className="text-center text-sm text-muted-foreground">
                      No comments yet. Be the first to comment!
                    </p>
                  ) : (
                    comments.map((comment, index) => (
                      <motion.div
                        key={comment.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex gap-3"
                      >
                        <Link to={`/profile/${comment.author.id}`}>
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.author.photoUrl} />
                            <AvatarFallback>
                              {comment.author.fullName?.[0] || comment.author.username?.[0] || 'U'}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="flex-1">
                          <div className="rounded-lg bg-muted p-3">
                            <Link to={`/profile/${comment.author.id}`}>
                              <p className="text-sm font-semibold text-brand-charcoal hover:text-brand-crimson">
                                {comment.author.fullName || comment.author.username}
                              </p>
                            </Link>
                            <p className="mt-1 text-sm text-brand-charcoal">{comment.content}</p>
                          </div>
                          <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                            <button
                              onClick={() => handleLikeComment(comment.id, comment.isLiked)}
                              className={cn(
                                'hover:text-brand-crimson',
                                comment.isLiked && 'text-brand-crimson'
                              )}
                            >
                              {comment.isLiked ? 'Liked' : 'Like'} ({comment.likes})
                            </button>
                            <button className="hover:text-brand-blue">Reply</button>
                            <span>{formatRelativeTime(comment.createdAt)}</span>
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  )
}
