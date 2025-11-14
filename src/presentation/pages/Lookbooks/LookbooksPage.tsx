import { useState } from 'react'
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
import { Link } from 'react-router-dom'
import { showToast } from '@/shared/utils/toast'

const lookbooks = [
  {
    id: 1,
    title: 'Summer Essentials 2024',
    description: 'Light and breezy outfits perfect for warm weather',
    coverImage:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&h=1000&fit=crop',
    outfitCount: 12,
    likes: 2847,
    views: 15234,
    saves: 892,
    author: {
      name: 'Emma Wilson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    },
    createdAt: '2 days ago',
    trending: true,
  },
  {
    id: 2,
    title: 'Office Chic Collection',
    description: 'Professional yet stylish workwear combinations',
    coverImage:
      'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800&h=1000&fit=crop',
    outfitCount: 18,
    likes: 3421,
    views: 22109,
    saves: 1203,
    author: {
      name: 'Sarah Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    createdAt: '5 days ago',
    trending: true,
  },
  {
    id: 3,
    title: 'Boho Paradise',
    description: 'Free-spirited and effortlessly elegant looks',
    coverImage:
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&h=1000&fit=crop',
    outfitCount: 15,
    likes: 1876,
    views: 9823,
    saves: 654,
    author: {
      name: 'Maya Rodriguez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    },
    createdAt: '1 week ago',
    trending: false,
  },
  {
    id: 4,
    title: 'Urban Street Style',
    description: 'Edgy and contemporary city fashion',
    coverImage:
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&h=1000&fit=crop',
    outfitCount: 20,
    likes: 4129,
    views: 28456,
    saves: 1567,
    author: {
      name: 'Alex Kim',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    createdAt: '3 days ago',
    trending: true,
  },
  {
    id: 5,
    title: 'Minimalist Wardrobe',
    description: 'Simple, versatile pieces for a capsule wardrobe',
    coverImage:
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=800&h=1000&fit=crop',
    outfitCount: 10,
    likes: 2156,
    views: 13287,
    saves: 923,
    author: {
      name: 'Sophie Anderson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    },
    createdAt: '4 days ago',
    trending: false,
  },
  {
    id: 6,
    title: 'Date Night Glam',
    description: 'Stunning outfits for special occasions',
    coverImage:
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&h=1000&fit=crop',
    outfitCount: 8,
    likes: 3892,
    views: 19445,
    saves: 1421,
    author: {
      name: 'Isabella Martinez',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella',
    },
    createdAt: '6 days ago',
    trending: true,
  },
]

export const LookbooksPage = () => {
  const [activeTab, setActiveTab] = useState('trending')

  const filteredLookbooks =
    activeTab === 'trending' ? lookbooks.filter((lb) => lb.trending) : lookbooks

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
            onClick={() => {
              showToast.success('Create Lookbook', 'Opening lookbook creator...')
              console.log('[Analytics] Create Lookbook clicked')
              // TODO: Navigate to /lookbooks/create when page is built
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            Create Lookbook
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="border-brand-crimson/20 p-4 transition-all hover:shadow-lg hover:shadow-brand-crimson/10">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-brand-crimson/10 p-3">
                  <BookOpen className="h-5 w-5 text-brand-crimson" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-brand-charcoal">{lookbooks.length}</p>
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
                    {lookbooks.reduce((sum, lb) => sum + lb.likes, 0).toLocaleString()}
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
                  <p className="text-2xl font-bold text-brand-charcoal">
                    {lookbooks.filter((lb) => lb.trending).length}
                  </p>
                  <p className="text-xs text-muted-foreground">Trending Now</p>
                </div>
              </div>
            </Card>
          </motion.div>
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
            {/* Lookbooks Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredLookbooks.map((lookbook, index) => (
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
                        {lookbook.trending && (
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
                            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full bg-white/90 hover:bg-white"
                          >
                            <Bookmark className="h-4 w-4" />
                          </Button>
                        </motion.div>

                        {/* Quick Actions - Mobile (always visible) */}
                        <div className="absolute right-3 top-3 flex gap-2 lg:hidden">
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white"
                          >
                            <Heart className="h-4 w-4" />
                          </Button>
                          <Button
                            size="icon"
                            variant="secondary"
                            className="h-8 w-8 rounded-full bg-white/95 backdrop-blur-sm hover:bg-white"
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
                              <span>{lookbook.saves.toLocaleString()}</span>
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
                              <AvatarImage src={lookbook.author.avatar} />
                              <AvatarFallback>{lookbook.author.name[0]}</AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium text-brand-charcoal">
                              {lookbook.author.name}
                            </span>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {lookbook.outfitCount} outfits
                          </Badge>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>{lookbook.createdAt}</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </MainLayout>
  )
}
