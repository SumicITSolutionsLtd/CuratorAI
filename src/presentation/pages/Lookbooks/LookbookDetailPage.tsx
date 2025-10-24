import { motion } from 'framer-motion'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import {
  Heart,
  Share2,
  Bookmark,
  MoreHorizontal,
  ShoppingBag,
  Eye,
  Calendar,
  ArrowLeft,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Badge } from '@/presentation/components/ui/badge'
import { Card } from '@/presentation/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/presentation/components/ui/avatar'
import { Separator } from '@/presentation/components/ui/separator'
import { Link } from 'react-router-dom'
import { OutfitCard } from '@/presentation/components/outfit/OutfitCard'

const lookbook = {
  id: 1,
  title: 'Summer Essentials 2024',
  description:
    'A carefully curated collection of light and breezy outfits perfect for warm weather. From beach days to rooftop brunches, these versatile pieces will keep you stylish and comfortable all season long.',
  coverImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=800&fit=crop',
  likes: 2847,
  views: 15234,
  saves: 892,
  author: {
    name: 'Emma Wilson',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    bio: 'Fashion enthusiast & style curator',
    followers: 12453,
  },
  createdAt: '2 days ago',
  tags: ['Summer', 'Casual', 'Beach', 'Vacation', 'Trending'],
}

const outfits = [
  {
    id: 1,
    name: 'Breezy Beach Day',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&h=800&fit=crop',
    items: [
      { name: 'Linen Midi Dress', brand: 'Reformation' },
      { name: 'Straw Tote Bag', brand: 'Lack of Color' },
    ],
    matchScore: 95,
    price: 248,
    likes: 432,
  },
  {
    id: 2,
    name: 'Sunset Rooftop',
    image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&h=800&fit=crop',
    items: [
      { name: 'Silk Slip Dress', brand: 'Zara' },
      { name: 'Strappy Sandals', brand: 'Steve Madden' },
    ],
    matchScore: 92,
    price: 179,
    likes: 521,
  },
  {
    id: 3,
    name: 'Casual Brunch',
    image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600&h=800&fit=crop',
    items: [
      { name: 'White Cotton Tee', brand: 'Everlane' },
      { name: 'High-Waisted Shorts', brand: "Levi's" },
    ],
    matchScore: 88,
    price: 95,
    likes: 387,
  },
  {
    id: 4,
    name: 'Garden Party',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600&h=800&fit=crop',
    items: [
      { name: 'Floral Maxi Dress', brand: 'Free People' },
      { name: 'Espadrille Wedges', brand: 'Castañer' },
    ],
    matchScore: 94,
    price: 298,
    likes: 612,
  },
]

export const LookbookDetailPage = () => {
  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-8"
      >
        {/* Back Button */}
        <Link to="/lookbooks">
          <Button variant="ghost" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Lookbooks
          </Button>
        </Link>

        {/* Hero Section */}
        <div className="grid gap-8 lg:grid-cols-2">
          {/* Cover Image */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-brand-beige shadow-2xl"
          >
            <img
              src={lookbook.coverImage}
              alt={lookbook.title}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          </motion.div>

          {/* Lookbook Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col justify-center space-y-6"
          >
            <div className="space-y-4">
              <h1 className="font-heading text-4xl font-bold text-brand-charcoal">
                {lookbook.title}
              </h1>
              <p className="text-lg leading-relaxed text-muted-foreground">
                {lookbook.description}
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2">
              {lookbook.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-brand-crimson/30 text-brand-crimson hover:bg-brand-crimson/10"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Author Info */}
            <Card className="bg-gradient-to-br from-brand-ivory to-brand-beige p-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16 ring-2 ring-brand-crimson/20">
                  <AvatarImage src={lookbook.author.avatar} />
                  <AvatarFallback>{lookbook.author.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <p className="font-semibold text-brand-charcoal">{lookbook.author.name}</p>
                  <p className="text-sm text-muted-foreground">{lookbook.author.bio}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {lookbook.author.followers.toLocaleString()} followers
                  </p>
                </div>
                <Button className="bg-brand-crimson hover:bg-brand-crimson/90">Follow</Button>
              </div>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-charcoal">
                  {lookbook.views.toLocaleString()}
                </p>
                <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Eye className="h-4 w-4" />
                  Views
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-crimson">
                  {lookbook.likes.toLocaleString()}
                </p>
                <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Heart className="h-4 w-4" />
                  Likes
                </p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-brand-blue">
                  {lookbook.saves.toLocaleString()}
                </p>
                <p className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                  <Bookmark className="h-4 w-4" />
                  Saves
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <Button className="h-12 flex-1 bg-brand-crimson hover:bg-brand-crimson/90">
                <Heart className="mr-2 h-5 w-5" />
                Like
              </Button>
              <Button
                variant="outline"
                className="h-12 flex-1 border-brand-blue text-brand-blue hover:bg-brand-blue/10"
              >
                <Bookmark className="mr-2 h-5 w-5" />
                Save
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <Share2 className="h-5 w-5" />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="h-4 w-4" />
              <span>Created {lookbook.createdAt}</span>
            </div>
          </motion.div>
        </div>

        <Separator />

        {/* Outfits Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold text-brand-charcoal">
                Outfit Collection
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {outfits.length} curated outfits in this lookbook
              </p>
            </div>
            <Button className="bg-brand-blue hover:bg-brand-blue/90">
              <ShoppingBag className="mr-2 h-4 w-4" />
              Shop All
            </Button>
          </div>

          {/* Outfits Grid */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {outfits.map((outfit, index) => (
              <motion.div
                key={outfit.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <OutfitCard {...outfit} />
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </MainLayout>
  )
}
