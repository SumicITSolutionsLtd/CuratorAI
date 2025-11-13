import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Send, X } from 'lucide-react'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../ui/sheet'
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
}

interface CommentDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postId: string
  commentCount: number
}

// Mock comments data
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
  {
    id: '5',
    author: {
      name: 'Olivia Brown',
      username: 'liv_style',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia',
    },
    text: 'You always know how to put together the perfect outfit! 👏',
    likes: 67,
    isLiked: false,
    timestamp: '8h ago',
  },
]

export const CommentDrawer = ({
  open,
  onOpenChange,
  commentCount: initialCommentCount,
}: CommentDrawerProps) => {
  const [comments, setComments] = useState<Comment[]>(mockComments)
  const [newComment, setNewComment] = useState('')
  const [commentCount, setCommentCount] = useState(initialCommentCount)

  // Reset when opened
  useEffect(() => {
    if (open) {
      setComments(mockComments)
      setCommentCount(initialCommentCount)
    }
  }, [open, initialCommentCount])

  const handleLikeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((comment) =>
        comment.id === commentId
          ? {
              ...comment,
              isLiked: !comment.isLiked,
              likes: comment.isLiked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment
      )
    )
  }

  const handleSubmitComment = () => {
    if (!newComment.trim()) return

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

    setComments((prev) => [comment, ...prev])
    setCommentCount((prev) => prev + 1)
    setNewComment('')
    showToast.success('Comment posted!')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmitComment()
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="flex h-[90vh] flex-col p-0">
        <SheetHeader className="border-b border-border px-6 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-montserrat text-xl">Comments ({commentCount})</SheetTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
              className="h-8 w-8"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </SheetHeader>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <AnimatePresence initial={false}>
            {comments.map((comment) => (
              <motion.div
                key={comment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className="mb-6 flex gap-3"
              >
                <Avatar className="h-10 w-10 shrink-0">
                  <AvatarImage src={comment.author.avatar} />
                  <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                </Avatar>

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm font-medium text-foreground">
                      {comment.author.name}
                    </span>
                    <span className="text-xs text-muted-foreground">{comment.timestamp}</span>
                  </div>

                  <p className="mt-1 text-sm leading-relaxed text-foreground">{comment.text}</p>

                  <div className="mt-2 flex items-center gap-4">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleLikeComment(comment.id)}
                      className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-brand-crimson"
                    >
                      <Heart
                        className={cn(
                          'h-4 w-4',
                          comment.isLiked && 'fill-brand-crimson text-brand-crimson'
                        )}
                      />
                      {comment.likes > 0 && (
                        <span className={cn(comment.isLiked && 'font-medium text-brand-crimson')}>
                          {comment.likes}
                        </span>
                      )}
                    </motion.button>

                    <button className="text-xs text-muted-foreground transition-colors hover:text-foreground">
                      Reply
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {comments.length === 0 && (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <p className="text-muted-foreground">No comments yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Be the first to comment!</p>
            </div>
          )}
        </div>

        {/* Comment Input */}
        <div className="border-t border-border bg-background p-4">
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
      </SheetContent>
    </Sheet>
  )
}
