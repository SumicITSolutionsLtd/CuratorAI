import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Send, X, Reply, CornerDownRight, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Skeleton } from '../ui/skeleton'
import { showToast } from '../../../shared/utils/toast'
import { cn } from '../../../shared/utils/cn'
import { useAppDispatch } from '@/shared/hooks/useAppDispatch'
import { useAppSelector } from '@/shared/hooks/useAppSelector'
import {
  fetchComments,
  addComment,
  likeComment,
  unlikeComment,
} from '@/shared/store/slices/socialSlice'
import { Comment } from '@domain/entities/Social'

interface CommentSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: string
  commentCount: number
}

// Format timestamp helper
const formatTimestamp = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return `${Math.floor(diffDays / 7)}w ago`
}

const CommentItem = ({
  comment,
  onLike,
  onReply,
  isReply = false,
  isLiking = false,
}: {
  comment: Comment
  onLike: (commentId: string, isLiked: boolean) => void
  onReply: (comment: Comment) => void
  isReply?: boolean
  isLiking?: boolean
}) => {
  return (
    <div className={cn('flex gap-3', isReply && 'ml-12 mt-3')}>
      {isReply && <CornerDownRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />}
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={comment.author.photoUrl} />
        <AvatarFallback>{comment.author.fullName?.[0] || 'U'}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-foreground">{comment.author.fullName}</span>
          <span className="text-xs text-muted-foreground">
            {formatTimestamp(comment.createdAt)}
          </span>
        </div>

        <p className="mt-1 break-words text-sm leading-relaxed text-foreground">
          {comment.content}
        </p>

        <div className="mt-2 flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onLike(comment.id, comment.isLiked)}
            disabled={isLiking}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-brand-crimson disabled:opacity-50"
          >
            <Heart
              className={cn('h-4 w-4', comment.isLiked && 'fill-brand-crimson text-brand-crimson')}
            />
            {comment.likes > 0 && (
              <span className={cn(comment.isLiked && 'font-medium text-brand-crimson')}>
                {comment.likes}
              </span>
            )}
          </motion.button>

          <button
            onClick={() => onReply(comment)}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            <Reply className="h-4 w-4" />
            Reply
          </button>
        </div>
      </div>
    </div>
  )
}

const CommentSkeleton = () => (
  <div className="flex gap-3">
    <Skeleton className="h-8 w-8 rounded-full" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-3/4" />
    </div>
  </div>
)

export const CommentSidebar = ({
  open,
  onOpenChange,
  postId,
  commentCount: initialCommentCount,
}: CommentSidebarProps) => {
  const dispatch = useAppDispatch()
  const { comments, isLoading, isPostActionLoading } = useAppSelector((state) => state.social)
  const { user } = useAppSelector((state) => state.auth)

  const [newComment, setNewComment] = useState('')
  const [commentCount, setCommentCount] = useState(initialCommentCount)
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null)
  const [likingCommentId, setLikingCommentId] = useState<string | null>(null)

  // Fetch comments when opened
  useEffect(() => {
    if (open && postId) {
      dispatch(fetchComments({ postId, page: 1, limit: 50 }))
      setCommentCount(initialCommentCount)
      setReplyingTo(null)
      setNewComment('')
    }
  }, [open, postId, dispatch, initialCommentCount])

  const handleLikeComment = useCallback(
    async (commentId: string, isLiked: boolean) => {
      if (likingCommentId) return

      setLikingCommentId(commentId)
      try {
        if (isLiked) {
          await dispatch(unlikeComment({ commentId })).unwrap()
        } else {
          await dispatch(likeComment({ commentId })).unwrap()
        }
      } catch {
        showToast.error('Failed to update like')
      } finally {
        setLikingCommentId(null)
      }
    },
    [dispatch, likingCommentId]
  )

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment)
    setNewComment(`@${comment.author.username} `)
  }

  const handleSubmitComment = async () => {
    if (!newComment.trim() || !postId) return

    try {
      await dispatch(
        addComment({
          postId,
          content: newComment,
          parentId: replyingTo?.id,
        })
      ).unwrap()

      setNewComment('')
      setReplyingTo(null)
      setCommentCount((prev) => prev + 1)
      showToast.success(replyingTo ? 'Reply posted!' : 'Comment posted!')
    } catch {
      showToast.error('Failed to post comment')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmitComment()
    }
  }

  const renderComments = () => {
    if (isLoading && comments.length === 0) {
      return (
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <CommentSkeleton key={i} />
          ))}
        </div>
      )
    }

    if (comments.length === 0) {
      return (
        <div className="flex h-full flex-col items-center justify-center text-center">
          <p className="text-muted-foreground">No comments yet</p>
          <p className="mt-1 text-sm text-muted-foreground">Be the first to comment!</p>
        </div>
      )
    }

    return comments.map((comment) => (
      <div key={comment.id} className="mb-6">
        <CommentItem
          comment={comment}
          onLike={handleLikeComment}
          onReply={handleReply}
          isLiking={likingCommentId === comment.id}
        />
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-3">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onLike={handleLikeComment}
                onReply={handleReply}
                isReply
                isLiking={likingCommentId === reply.id}
              />
            ))}
          </div>
        )}
      </div>
    ))
  }

  // User avatar and info from auth state
  const userAvatar =
    user?.profile?.photoUrl ||
    `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.username || 'user'}`
  const userInitial = user?.fullName?.[0] || user?.username?.[0] || 'U'

  if (!open) return null

  return (
    <>
      {/* Mobile/Tablet - Bottom Sheet */}
      <div className="lg:hidden">
        <AnimatePresence>
          {open && (
            <>
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => onOpenChange(false)}
                className="fixed inset-0 bg-black/50"
                style={{ zIndex: 9998 }}
              />

              {/* Bottom Sheet */}
              <motion.div
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                className="fixed bottom-0 left-0 right-0 flex h-[90vh] flex-col rounded-t-3xl bg-background shadow-2xl"
                style={{ zIndex: 9999 }}
              >
                {/* Header */}
                <div className="shrink-0 border-b border-border px-6 py-4">
                  <div className="flex items-center justify-between">
                    <h2 className="font-montserrat text-xl font-semibold">
                      Comments ({commentCount})
                    </h2>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onOpenChange(false)}
                      className="h-8 w-8"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>
                </div>

                {/* Comments List */}
                <div className="flex-1 overflow-y-auto px-6 py-4">{renderComments()}</div>

                {/* Comment Input */}
                <div className="shrink-0 border-t border-border bg-background p-4">
                  {replyingTo && (
                    <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Reply className="h-3 w-3" />
                      <span>
                        Replying to <strong>{replyingTo.author.fullName}</strong>
                      </span>
                      <button
                        onClick={() => {
                          setReplyingTo(null)
                          setNewComment('')
                        }}
                        className="ml-auto hover:text-foreground"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                  <div className="flex items-end gap-3">
                    <Avatar className="h-8 w-8 shrink-0">
                      <AvatarImage src={userAvatar} />
                      <AvatarFallback>{userInitial}</AvatarFallback>
                    </Avatar>

                    <div className="relative flex-1">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Add a comment..."
                        rows={1}
                        className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-crimson"
                      />

                      <Button
                        size="icon"
                        disabled={!newComment.trim() || isPostActionLoading}
                        onClick={handleSubmitComment}
                        className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-brand-crimson hover:bg-brand-crimson/90 disabled:opacity-50"
                      >
                        {isPostActionLoading ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Send className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>

      {/* Desktop - Right Sidebar */}
      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => onOpenChange(false)}
              className="fixed inset-0 hidden bg-black/30 lg:block"
              style={{ zIndex: 9998 }}
            />

            {/* Sidebar */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed bottom-0 right-0 top-0 hidden w-[480px] flex-col bg-background shadow-2xl lg:flex"
              style={{ zIndex: 9999 }}
            >
              {/* Header */}
              <div className="shrink-0 border-b border-border px-6 py-5">
                <div className="flex items-center justify-between">
                  <h2 className="font-montserrat text-xl font-semibold">
                    Comments ({commentCount})
                  </h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onOpenChange(false)}
                    className="h-8 w-8"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Comments List */}
              <div className="flex-1 overflow-y-auto px-6 py-6">{renderComments()}</div>

              {/* Comment Input */}
              <div className="shrink-0 border-t border-border bg-background p-6">
                {replyingTo && (
                  <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Reply className="h-4 w-4" />
                    <span>
                      Replying to <strong>{replyingTo.author.fullName}</strong>
                    </span>
                    <button
                      onClick={() => {
                        setReplyingTo(null)
                        setNewComment('')
                      }}
                      className="ml-auto hover:text-foreground"
                    >
                      Cancel
                    </button>
                  </div>
                )}
                <div className="flex items-end gap-3">
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarImage src={userAvatar} />
                    <AvatarFallback>{userInitial}</AvatarFallback>
                  </Avatar>

                  <div className="relative flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Add a comment..."
                      rows={2}
                      className="w-full resize-none rounded-xl border border-border bg-background px-4 py-3 pr-12 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-crimson"
                    />

                    <Button
                      size="icon"
                      disabled={!newComment.trim() || isPostActionLoading}
                      onClick={handleSubmitComment}
                      className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-brand-crimson hover:bg-brand-crimson/90 disabled:opacity-50"
                    >
                      {isPostActionLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
