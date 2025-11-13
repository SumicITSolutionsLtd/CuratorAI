import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Send, X, Reply, CornerDownRight } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { showToast } from '../../../shared/utils/toast'
import { cn } from '../../../shared/utils/cn'

interface Comment {
  id: string
  author: {
    name: string
    username: string
    avatar: string
  }
  text: string
  likes: number
  isLiked: boolean
  timestamp: string
  replies?: Comment[]
}

interface CommentSidebarProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: string
  commentCount: number
}

// Mock comments data with nested replies
const mockComments: Comment[] = [
  {
    id: '1',
    author: {
      name: 'Sarah Johnson',
      username: 'sarah_j',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    text: 'Love this look! Where did you get those shoes? 😍',
    likes: 24,
    isLiked: false,
    timestamp: '2h ago',
    replies: [
      {
        id: '1-1',
        author: {
          name: 'Emily Rodriguez',
          username: 'emily_style',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
        },
        text: 'Thanks! Got them from Zara last week!',
        likes: 8,
        isLiked: false,
        timestamp: '1h ago',
      },
    ],
  },
  {
    id: '2',
    author: {
      name: 'Mike Chen',
      username: 'mike_style',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
    },
    text: 'This is giving me major inspo for my wardrobe refresh!',
    likes: 12,
    isLiked: false,
    timestamp: '3h ago',
  },
  {
    id: '3',
    author: {
      name: 'Emma Wilson',
      username: 'emma_w',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    },
    text: 'Absolutely stunning! The color combination is perfect 🔥',
    likes: 45,
    isLiked: true,
    timestamp: '5h ago',
    replies: [
      {
        id: '3-1',
        author: {
          name: 'Alex Chen',
          username: 'alex_fashion',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
        },
        text: 'I agree! The colors are so well coordinated',
        likes: 5,
        isLiked: false,
        timestamp: '4h ago',
      },
      {
        id: '3-2',
        author: {
          name: 'Sophia Martinez',
          username: 'sophia_chic',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia',
        },
        text: 'Color theory at its finest!',
        likes: 3,
        isLiked: false,
        timestamp: '4h ago',
      },
    ],
  },
  {
    id: '4',
    author: {
      name: 'James Lee',
      username: 'james_fashion',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James',
    },
    text: 'Need this outfit in my life ASAP! 💯',
    likes: 8,
    isLiked: false,
    timestamp: '6h ago',
  },
]

const CommentItem = ({
  comment,
  onLike,
  onReply,
  isReply = false,
}: {
  comment: Comment
  onLike: (id: string) => void
  onReply: (comment: Comment) => void
  isReply?: boolean
}) => {
  return (
    <div className={cn('flex gap-3', isReply && 'ml-12 mt-3')}>
      {isReply && <CornerDownRight className="mt-1 h-4 w-4 shrink-0 text-muted-foreground" />}
      <Avatar className="h-8 w-8 shrink-0">
        <AvatarImage src={comment.author.avatar} />
        <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
      </Avatar>

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="text-sm font-medium text-foreground">{comment.author.name}</span>
          <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
        </div>

        <p className="mt-1 break-words text-sm leading-relaxed text-foreground">{comment.text}</p>

        <div className="mt-2 flex items-center gap-4">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => onLike(comment.id)}
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-brand-crimson"
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

export const CommentSidebar = ({
  open,
  onOpenChange,
  commentCount: initialCommentCount,
}: CommentSidebarProps) => {
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState('')
  const [commentCount, setCommentCount] = useState(initialCommentCount)
  const [replyingTo, setReplyingTo] = useState<Comment | null>(null)

  // Reset when opened
  useEffect(() => {
    if (open) {
      setComments(mockComments)
      setCommentCount(initialCommentCount)
      setReplyingTo(null)
    }
  }, [open, initialCommentCount])

  const handleLikeComment = (commentId: string) => {
    const updateComments = (comments: Comment[]): Comment[] => {
      return comments.map((comment) => {
        if (comment.id === commentId) {
          return {
            ...comment,
            isLiked: !comment.isLiked,
            likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
          }
        }
        if (comment.replies) {
          return {
            ...comment,
            replies: updateComments(comment.replies),
          }
        }
        return comment
      })
    }
    setComments(updateComments(comments))
  }

  const handleReply = (comment: Comment) => {
    setReplyingTo(comment)
    setNewComment(`@${comment.author.username} `)
  }

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

    if (replyingTo) {
      // Add reply
      const reply: Comment = {
        id: `${replyingTo.id}-${Date.now()}`,
        author: {
          name: 'You',
          username: 'your_username',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
        },
        text: newComment,
        likes: 0,
        isLiked: false,
        timestamp: 'Just now',
      }

      const addReply = (comments: Comment[]): Comment[] => {
        return comments.map((comment) => {
          if (comment.id === replyingTo.id) {
            return {
              ...comment,
              replies: [...(comment.replies || []), reply],
            }
          }
          if (comment.replies) {
            return {
              ...comment,
              replies: addReply(comment.replies),
            }
          }
          return comment
        })
      }

      setComments(addReply(comments))
      setReplyingTo(null)
    } else {
      // Add new comment
      const comment: Comment = {
        id: Date.now().toString(),
        author: {
          name: 'You',
          username: 'your_username',
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
        },
        text: newComment,
        likes: 0,
        isLiked: false,
        timestamp: 'Just now',
      }

      setComments([comment, ...comments])
      setCommentCount((prev) => prev + 1)
    }

    setNewComment('')
    showToast.success(replyingTo ? 'Reply posted!' : 'Comment posted!')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmitComment()
    }
  }

  const renderComments = (comments: Comment[]) => {
    return comments.map((comment) => (
      <div key={comment.id} className="mb-6">
        <CommentItem comment={comment} onLike={handleLikeComment} onReply={handleReply} />
        {comment.replies && comment.replies.length > 0 && (
          <div className="space-y-3">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                onLike={handleLikeComment}
                onReply={handleReply}
                isReply
              />
            ))}
          </div>
        )}
      </div>
    ))
  }

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
                <div className="flex-1 overflow-y-auto px-6 py-4">
                  {comments.length > 0 ? (
                    renderComments(comments)
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center text-center">
                      <p className="text-muted-foreground">No comments yet</p>
                      <p className="mt-1 text-sm text-muted-foreground">Be the first to comment!</p>
                    </div>
                  )}
                </div>

                {/* Comment Input */}
                <div className="shrink-0 border-t border-border bg-background p-4">
                  {replyingTo && (
                    <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <Reply className="h-3 w-3" />
                      <span>
                        Replying to <strong>{replyingTo.author.name}</strong>
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
                      <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
                      <AvatarFallback>Y</AvatarFallback>
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
                        disabled={!newComment.trim()}
                        onClick={handleSubmitComment}
                        className="absolute right-2 top-1/2 h-8 w-8 -translate-y-1/2 rounded-full bg-brand-crimson hover:bg-brand-crimson/90 disabled:opacity-50"
                      >
                        <Send className="h-4 w-4" />
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
              <div className="flex-1 overflow-y-auto px-6 py-6">
                {comments.length > 0 ? (
                  renderComments(comments)
                ) : (
                  <div className="flex h-full flex-col items-center justify-center text-center">
                    <p className="text-muted-foreground">No comments yet</p>
                    <p className="mt-1 text-sm text-muted-foreground">Be the first to comment!</p>
                  </div>
                )}
              </div>

              {/* Comment Input */}
              <div className="shrink-0 border-t border-border bg-background p-6">
                {replyingTo && (
                  <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                    <Reply className="h-4 w-4" />
                    <span>
                      Replying to <strong>{replyingTo.author.name}</strong>
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
                    <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
                    <AvatarFallback>Y</AvatarFallback>
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
                      disabled={!newComment.trim()}
                      onClick={handleSubmitComment}
                      className="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-brand-crimson hover:bg-brand-crimson/90 disabled:opacity-50"
                    >
                      <Send className="h-4 w-4" />
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
