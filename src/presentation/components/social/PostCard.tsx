import { useState } from 'react'
import { motion } from 'framer-motion'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { cn } from '@/shared/utils/cn'

interface PostCardProps {
  id: string
  author: {
    name: string
    username: string
    avatar: string
  }
  images: string[]
  caption: string
  tags: string[]
  likes: number
  comments: number
  timeAgo: string
  isLiked?: boolean
  isSaved?: boolean
}

export const PostCard = ({
  author,
  images,
  caption,
  tags,
  likes: initialLikes,
  comments,
  timeAgo,
  isLiked: initialLiked = false,
  isSaved: initialSaved = false,
}: PostCardProps) => {
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [likes, setLikes] = useState(initialLikes)

  const handleLike = () => {
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
    >
      <Card className="overflow-hidden transition-shadow hover:shadow-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 ring-2 ring-brand-crimson/20">
              <AvatarImage src={author.avatar} />
              <AvatarFallback>{author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-semibold text-sm">{author.name}</p>
              <p className="text-xs text-muted-foreground">@{author.username} · {timeAgo}</p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Report</DropdownMenuItem>
              <DropdownMenuItem>Share</DropdownMenuItem>
              <DropdownMenuItem>Copy Link</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Image(s) */}
        <div className="relative aspect-square overflow-hidden bg-muted">
          <motion.img
            src={images[0]}
            alt="Post"
            className="h-full w-full object-cover"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          {images.length > 1 && (
            <div className="absolute bottom-2 right-2">
              <Badge variant="secondary" className="backdrop-blur-sm">
                1/{images.length}
              </Badge>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex gap-1">
              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLike}
                  className={cn(isLiked && 'text-brand-crimson')}
                >
                  <Heart
                    className={cn(
                      'h-5 w-5',
                      isLiked && 'fill-current'
                    )}
                  />
                </Button>
              </motion.div>

              <motion.div whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="sm">
                  <MessageCircle className="h-5 w-5" />
                </Button>
              </motion.div>

              <motion.div whileTap={{ scale: 0.9 }}>
                <Button variant="ghost" size="sm">
                  <Share2 className="h-5 w-5" />
                </Button>
              </motion.div>
            </div>

            <motion.div whileTap={{ scale: 0.9 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsSaved(!isSaved)}
                className={cn(isSaved && 'text-brand-blue')}
              >
                <Bookmark
                  className={cn(
                    'h-5 w-5',
                    isSaved && 'fill-current'
                  )}
                />
              </Button>
            </motion.div>
          </div>

          {/* Likes */}
          <p className="mb-2 font-semibold text-sm">
            {likes.toLocaleString()} likes
          </p>

          {/* Caption */}
          <p className="mb-2 text-sm">
            <span className="font-semibold">{author.username}</span>{' '}
            <span className="text-muted-foreground">{caption}</span>
          </p>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span key={tag} className="text-brand-blue text-sm">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Comments */}
          {comments > 0 && (
            <button className="text-sm text-muted-foreground hover:text-foreground">
              View all {comments} comments
            </button>
          )}
        </div>
      </Card>
    </motion.div>
  )
}
