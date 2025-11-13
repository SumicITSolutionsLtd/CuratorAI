import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Flag,
  Link,
  Eye,
} from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'
import { Button } from '../ui/button'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { CommentSidebar } from './CommentSidebar'
import { ShareSidebar } from './ShareSidebar'
import { ReportDialog } from './ReportDialog'
import { UserPreviewCard } from './UserPreviewCard'
import { cn } from '@/shared/utils/cn'
import { showToast } from '@/shared/utils/toast'

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
  id,
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
  const navigate = useNavigate()
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [likes, setLikes] = useState(initialLikes)
  const [shareSheetOpen, setShareSheetOpen] = useState(false)
  const [commentDrawerOpen, setCommentDrawerOpen] = useState(false)
  const [reportDialogOpen, setReportDialogOpen] = useState(false)

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
    setLikes(isLiked ? likes - 1 : likes + 1)
    if (!isLiked) {
      showToast.like('Liked!')
    }
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsSaved(!isSaved)
    if (!isSaved) {
      showToast.success('Saved to collection!')
    } else {
      showToast.success('Removed from collection')
    }
  }

  const handleCopyLink = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    const postUrl = `${window.location.origin}/posts/${id}`
    navigator.clipboard.writeText(postUrl)
    showToast.success('Link copied to clipboard!')
  }

  const handleViewPost = (e?: React.MouseEvent) => {
    e?.stopPropagation()
    navigate(`/posts/${id}`)
  }

  const handleOpenComments = (e: React.MouseEvent) => {
    e.stopPropagation()
    setCommentDrawerOpen(true)
  }

  const handleOpenShare = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShareSheetOpen(true)
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
      >
        <Card
          className="cursor-pointer overflow-hidden transition-shadow hover:shadow-lg"
          onClick={handleViewPost}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4">
            <UserPreviewCard
              userId={id}
              username={author.username}
              fullName={author.name}
              photoUrl={author.avatar}
              followers={Math.floor(Math.random() * 10000) + 100}
              following={Math.floor(Math.random() * 1000) + 50}
              posts={Math.floor(Math.random() * 100) + 10}
            >
              <div className="flex cursor-pointer items-center gap-3">
                <Avatar className="h-10 w-10 ring-2 ring-brand-crimson/20">
                  <AvatarImage src={author.avatar} />
                  <AvatarFallback>{author.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold hover:underline">{author.name}</p>
                  <p className="text-xs text-muted-foreground">
                    @{author.username} · {timeAgo}
                  </p>
                </div>
              </div>
            </UserPreviewCard>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" onClick={(e) => e.stopPropagation()}>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    handleViewPost()
                  }}
                >
                  <Eye className="mr-2 h-4 w-4" />
                  View Post
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    setShareSheetOpen(true)
                  }}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    handleCopyLink()
                  }}
                >
                  <Link className="mr-2 h-4 w-4" />
                  Copy Link
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation()
                    setReportDialogOpen(true)
                  }}
                  className="text-red-600 dark:text-red-400"
                >
                  <Flag className="mr-2 h-4 w-4" />
                  Report
                </DropdownMenuItem>
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
                    <Heart className={cn('h-5 w-5', isLiked && 'fill-current')} />
                  </Button>
                </motion.div>

                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="sm" onClick={handleOpenComments}>
                    <MessageCircle className="h-5 w-5" />
                  </Button>
                </motion.div>

                <motion.div whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="sm" onClick={handleOpenShare}>
                    <Share2 className="h-5 w-5" />
                  </Button>
                </motion.div>
              </div>

              <motion.div whileTap={{ scale: 0.9 }}>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSave}
                  className={cn(isSaved && 'text-brand-blue')}
                >
                  <Bookmark className={cn('h-5 w-5', isSaved && 'fill-current')} />
                </Button>
              </motion.div>
            </div>

            {/* Likes */}
            <p className="mb-2 text-sm font-semibold">{likes.toLocaleString()} likes</p>

            {/* Caption */}
            <p className="mb-2 text-sm">
              <span className="font-semibold">{author.username}</span>{' '}
              <span className="text-muted-foreground">{caption}</span>
            </p>

            {/* Tags */}
            {tags.length > 0 && (
              <div className="mb-2 flex flex-wrap gap-1">
                {tags.map((tag) => (
                  <span key={tag} className="text-sm text-brand-blue">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Comments */}
            {comments > 0 && (
              <button
                onClick={handleOpenComments}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                View all {comments} comments
              </button>
            )}
          </div>
        </Card>
      </motion.div>

      {/* Modals & Sidebars - Outside card to avoid positioning issues */}
      <ShareSidebar open={shareSheetOpen} onOpenChange={setShareSheetOpen} postId={id} />
      <CommentSidebar
        open={commentDrawerOpen}
        onOpenChange={setCommentDrawerOpen}
        postId={id}
        commentCount={comments}
      />
      <ReportDialog
        open={reportDialogOpen}
        onOpenChange={setReportDialogOpen}
        postId={id}
        postAuthor={author.name}
      />
    </>
  )
}
