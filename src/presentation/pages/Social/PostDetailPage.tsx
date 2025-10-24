import { useState } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import {
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreHorizontal,
  Send,
  MapPin,
  Calendar,
  ArrowLeft,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Card } from '@/presentation/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/presentation/components/ui/avatar'
import { Badge } from '@/presentation/components/ui/badge'
import { Separator } from '@/presentation/components/ui/separator'
import { Link, useNavigate } from 'react-router-dom'
import { cn } from '@/shared/utils/cn'

const post = {
  id: 1,
  author: {
    name: 'Emma Wilson',
    username: '@emmawilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    followers: 12453,
  },
  images: [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=1600&fit=crop',
    'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=1600&fit=crop',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200&h=1600&fit=crop',
  ],
  caption:
    'Perfect summer brunch outfit! ☀️ Love how this linen dress flows. Paired it with my favorite sandals and a straw bag. What do you think? #OOTD #SummerStyle #BrunchOutfit',
  tags: ['#OOTD', '#SummerStyle', '#BrunchOutfit'],
  location: 'San Francisco, CA',
  likes: 2847,
  comments: 134,
  shares: 45,
  saves: 892,
  timestamp: '2 hours ago',
  items: [
    { name: 'Linen Midi Dress', brand: 'Reformation', price: 198 },
    { name: 'Straw Tote Bag', brand: 'Lack of Color', price: 89 },
    { name: 'Leather Sandals', brand: 'Ancient Greek Sandals', price: 245 },
  ],
}

const comments = [
  {
    id: 1,
    author: {
      name: 'Sarah Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    text: 'Love this look! Where did you get that dress? 😍',
    likes: 24,
    timestamp: '1 hour ago',
  },
  {
    id: 2,
    author: {
      name: 'Alex Kim',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    text: 'The color combination is perfect! So summery and fresh 🌸',
    likes: 18,
    timestamp: '45 minutes ago',
  },
  {
    id: 3,
    author: {
      name: 'Maya Rodriguez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    },
    text: 'This is giving me major vacation vibes! Adding to my inspo board 📌',
    likes: 31,
    timestamp: '30 minutes ago',
  },
]

export const PostDetailPage = () => {
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [comment, setComment] = useState('')
  const [localComments, setLocalComments] = useState(comments)

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev === post.images.length - 1 ? 0 : prev + 1))
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev === 0 ? post.images.length - 1 : prev - 1))
  }

  const handleComment = () => {
    if (comment.trim()) {
      setLocalComments([
        {
          id: Date.now(),
          author: {
            name: 'You',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=You',
          },
          text: comment,
          likes: 0,
          timestamp: 'Just now',
        },
        ...localComments,
      ])
      setComment('')
    }
  }

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
                <img
                  src={post.images[currentImageIndex]}
                  alt={`Post ${currentImageIndex + 1}`}
                  className="h-full w-full object-cover"
                />

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
                <div className="absolute right-4 top-4 flex gap-2">
                  <Badge className="bg-white/90 text-brand-charcoal hover:bg-white">
                    {currentImageIndex + 1} / {post.images.length}
                  </Badge>
                </div>
              </div>

              {/* Action Bar */}
              <div className="border-t p-4">
                <div className="flex items-center justify-between">
                  <div className="flex gap-4">
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsLiked(!isLiked)}
                      className="group flex items-center gap-2"
                    >
                      <Heart
                        className={cn(
                          'h-6 w-6 transition-colors',
                          isLiked
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

                    <button className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                      <Share2 className="h-6 w-6" />
                      <span className="text-sm font-medium">{post.shares}</span>
                    </button>
                  </div>

                  <div className="flex gap-2">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={() => setIsSaved(!isSaved)}>
                      <Bookmark
                        className={cn(
                          'h-6 w-6 transition-colors',
                          isSaved
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
            {/* Author Card */}
            <Card className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Link to={`/profile/${post.author.username}`}>
                    <Avatar className="h-12 w-12 ring-2 ring-brand-crimson/20">
                      <AvatarImage src={post.author.avatar} />
                      <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link to={`/profile/${post.author.username}`}>
                      <p className="font-semibold text-brand-charcoal transition-colors hover:text-brand-crimson">
                        {post.author.name}
                      </p>
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      {post.author.followers.toLocaleString()} followers
                    </p>
                  </div>
                </div>
                <Button className="bg-brand-crimson hover:bg-brand-crimson/90">Follow</Button>
              </div>

              <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {post.timestamp}
                </div>
                {post.location && (
                  <>
                    <span>•</span>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {post.location}
                    </div>
                  </>
                )}
              </div>
            </Card>

            {/* Caption */}
            <Card className="p-4">
              <p className="whitespace-pre-line text-sm text-brand-charcoal">{post.caption}</p>
              {post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="border-brand-crimson/30 text-brand-crimson hover:bg-brand-crimson/10"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </Card>

            {/* Products */}
            <Card className="p-4">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold text-brand-charcoal">Products in this post</h3>
                <ShoppingBag className="h-5 w-5 text-brand-crimson" />
              </div>
              <div className="space-y-3">
                {post.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between rounded-lg p-2 transition-colors hover:bg-muted"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium text-brand-charcoal">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.brand}</p>
                    </div>
                    <p className="text-sm font-semibold text-brand-charcoal">${item.price}</p>
                  </div>
                ))}
                <Button className="w-full bg-brand-blue hover:bg-brand-blue/90">
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Shop Similar
                </Button>
              </div>
            </Card>

            {/* Comments */}
            <Card className="p-4">
              <h3 className="mb-4 font-semibold text-brand-charcoal">
                Comments ({localComments.length})
              </h3>

              {/* Comment Input */}
              <div className="mb-4 flex gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="https://api.dicebear.com/7.x/avataaars/svg?seed=You" />
                  <AvatarFallback>You</AvatarFallback>
                </Avatar>
                <div className="flex flex-1 gap-2">
                  <Input
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleComment()}
                  />
                  <Button
                    size="icon"
                    onClick={handleComment}
                    disabled={!comment.trim()}
                    className="bg-brand-crimson hover:bg-brand-crimson/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Separator className="my-4" />

              {/* Comments List */}
              <div className="max-h-[400px] space-y-4 overflow-y-auto">
                {localComments.map((comment, index) => (
                  <motion.div
                    key={comment.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex gap-3"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.author.avatar} />
                      <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="rounded-lg bg-muted p-3">
                        <p className="text-sm font-semibold text-brand-charcoal">
                          {comment.author.name}
                        </p>
                        <p className="mt-1 text-sm text-brand-charcoal">{comment.text}</p>
                      </div>
                      <div className="mt-1 flex items-center gap-4 text-xs text-muted-foreground">
                        <button className="hover:text-brand-crimson">Like ({comment.likes})</button>
                        <button className="hover:text-brand-blue">Reply</button>
                        <span>{comment.timestamp}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  )
}
