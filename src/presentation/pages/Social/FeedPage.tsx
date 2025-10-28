import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import { PostCard } from '@/presentation/components/social/PostCard'
import { Button } from '@/presentation/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/presentation/components/ui/tabs'

const mockPosts = [
  {
    id: '1',
    author: {
      name: 'Emily Rodriguez',
      username: 'emily_style',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emily',
    },
    images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600'],
    caption: 'Perfect summer outfit for brunch with the girls! ☀️💕',
    tags: ['OOTD', 'SummerStyle', 'BrunchLook'],
    likes: 1234,
    comments: 45,
    timeAgo: '2h',
  },
  {
    id: '2',
    author: {
      name: 'Alex Chen',
      username: 'alexfashion',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
    },
    images: ['https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=600'],
    caption: 'Street style vibes in the city 🏙️',
    tags: ['StreetWear', 'UrbanStyle', 'OOTD'],
    likes: 892,
    comments: 23,
    timeAgo: '4h',
  },
  {
    id: '3',
    author: {
      name: 'Sarah Johnson',
      username: 'sarahjstyle',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    },
    images: ['https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=600'],
    caption: 'Office chic for the win! 💼✨',
    tags: ['WorkWear', 'Professional', 'FashionInspo'],
    likes: 1567,
    comments: 67,
    timeAgo: '6h',
  },
  {
    id: '4',
    author: {
      name: 'Maya Patel',
      username: 'mayastyle',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maya',
    },
    images: ['https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=600'],
    caption: 'Boho vibes for festival season! 🌸🎪',
    tags: ['BohoChic', 'Festival', 'FreeSpirit'],
    likes: 2103,
    comments: 89,
    timeAgo: '8h',
  },
]

export const FeedPage = () => {
  return (
    <MainLayout>
      <div className="mx-auto max-w-2xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <h1 className="text-2xl font-bold sm:text-3xl">Feed</h1>
          <Button className="bg-brand-crimson hover:bg-brand-crimson/90">
            <Plus className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Create Post</span>
            <span className="sm:hidden">Post</span>
          </Button>
        </motion.div>

        {/* Tabs */}
        <Tabs defaultValue="forYou" className="w-full">
          <TabsList className="w-full">
            <TabsTrigger value="forYou" className="flex-1">
              For You
            </TabsTrigger>
            <TabsTrigger value="following" className="flex-1">
              Following
            </TabsTrigger>
            <TabsTrigger value="trending" className="flex-1">
              Trending
            </TabsTrigger>
          </TabsList>

          <TabsContent value="forYou" className="mt-6 space-y-6">
            {mockPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <PostCard {...post} />
              </motion.div>
            ))}
          </TabsContent>

          <TabsContent value="following" className="mt-6">
            <div className="rounded-lg border bg-muted/50 p-12 text-center">
              <p className="text-muted-foreground">Follow more users to see their posts here</p>
            </div>
          </TabsContent>

          <TabsContent value="trending" className="mt-6">
            <div className="rounded-lg border bg-muted/50 p-12 text-center">
              <p className="text-muted-foreground">Trending posts will appear here</p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  )
}
