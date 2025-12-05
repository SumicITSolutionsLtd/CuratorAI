import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import {
  ArrowLeft,
  Folder,
  Heart,
  Trash2,
  Plus,
  Edit2,
  MoreHorizontal,
  Sparkles,
  Loader2,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Badge } from '@/presentation/components/ui/badge'
import { Card } from '@/presentation/components/ui/card'
import { OutfitCard } from '@/presentation/components/outfit/OutfitCard'
import { showToast } from '@/shared/utils/toast'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/presentation/components/ui/dropdown-menu'

// Mock collection data - will be replaced with actual API data
const mockCollectionData: Record<
  string,
  {
    id: string
    name: string
    description: string
    itemCount: number
    createdAt: string
    items: Array<{
      id: string
      name: string
      image: string
      matchScore: number
      likes: number
      items: Array<{ name: string; brand?: string }>
    }>
  }
> = {
  summer: {
    id: 'summer',
    name: 'Summer Vacation',
    description: 'Perfect outfits for beach trips and sunny days',
    itemCount: 12,
    createdAt: '2024-06-15',
    items: [
      {
        id: '1',
        name: 'Beach Day Vibes',
        image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
        matchScore: 92,
        likes: 234,
        items: [
          { name: 'Floral Sundress', brand: 'Reformation' },
          { name: 'Straw Hat', brand: 'Lack of Color' },
        ],
      },
      {
        id: '2',
        name: 'Tropical Getaway',
        image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400',
        matchScore: 88,
        likes: 156,
        items: [
          { name: 'Linen Pants', brand: 'Everlane' },
          { name: 'Cotton Blouse', brand: 'Madewell' },
        ],
      },
    ],
  },
  fall: {
    id: 'fall',
    name: 'Fall Wardrobe',
    description: 'Cozy and stylish looks for autumn',
    itemCount: 8,
    createdAt: '2024-09-01',
    items: [
      {
        id: '3',
        name: 'Cozy Autumn Look',
        image: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
        matchScore: 95,
        likes: 312,
        items: [
          { name: 'Cashmere Sweater', brand: 'Naadam' },
          { name: 'High-Waist Jeans', brand: 'Agolde' },
        ],
      },
    ],
  },
  work: {
    id: 'work',
    name: 'Work Essentials',
    description: 'Professional outfits for the office',
    itemCount: 15,
    createdAt: '2024-01-10',
    items: [
      {
        id: '4',
        name: 'Corporate Chic',
        image: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400',
        matchScore: 90,
        likes: 189,
        items: [
          { name: 'Tailored Blazer', brand: 'Theory' },
          { name: 'Silk Blouse', brand: 'Equipment' },
        ],
      },
      {
        id: '5',
        name: 'Smart Casual Friday',
        image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400',
        matchScore: 87,
        likes: 145,
        items: [
          { name: 'Knit Dress', brand: 'COS' },
          { name: 'Leather Loafers', brand: 'Everlane' },
        ],
      },
    ],
  },
}

export const CollectionDetailPage = () => {
  const { collectionId } = useParams<{ collectionId: string }>()
  const navigate = useNavigate()

  const [collection, setCollection] = useState<(typeof mockCollectionData)['summer'] | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true)
    setTimeout(() => {
      if (collectionId && mockCollectionData[collectionId]) {
        setCollection(mockCollectionData[collectionId])
      }
      setIsLoading(false)
    }, 500)
  }, [collectionId])

  const handleDeleteCollection = () => {
    showToast.success('Collection deleted', 'Your collection has been removed')
    navigate('/wishlist')
  }

  const handleRemoveItem = (itemId: string) => {
    if (collection) {
      setCollection({
        ...collection,
        items: collection.items.filter((item) => item.id !== itemId),
        itemCount: collection.itemCount - 1,
      })
      showToast.success('Item removed', 'Item removed from collection')
    }
  }

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-brand-crimson" />
            <p className="text-lg font-semibold">Loading collection...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (!collection) {
    return (
      <MainLayout>
        <div className="flex min-h-[60vh] flex-col items-center justify-center">
          <Folder className="mb-4 h-16 w-16 text-muted-foreground/50" />
          <h2 className="mb-2 text-xl font-bold text-brand-charcoal">Collection not found</h2>
          <p className="mb-4 text-muted-foreground">
            This collection doesn&apos;t exist or has been deleted
          </p>
          <Button onClick={() => navigate('/wishlist')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Wishlist
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate('/wishlist')}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <div className="flex items-center gap-2">
                <Folder className="h-6 w-6 text-brand-crimson" />
                <h1 className="text-2xl font-bold text-brand-charcoal sm:text-3xl">
                  {collection.name}
                </h1>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{collection.description}</p>
              <div className="mt-2 flex items-center gap-3">
                <Badge variant="secondary" className="bg-brand-crimson/10 text-brand-crimson">
                  <Sparkles className="mr-1 h-3 w-3" />
                  {collection.itemCount} items
                </Badge>
                <span className="text-xs text-muted-foreground">
                  Created {new Date(collection.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Plus className="mr-2 h-4 w-4" />
              Add Items
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Edit2 className="mr-2 h-4 w-4" />
                  Rename Collection
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={handleDeleteCollection}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete Collection
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Items Grid */}
        {collection.items.length === 0 ? (
          <Card className="p-12 text-center">
            <Heart className="mx-auto mb-4 h-12 w-12 text-muted-foreground/50" />
            <h3 className="mb-2 text-lg font-semibold text-brand-charcoal">No items yet</h3>
            <p className="mb-4 text-sm text-muted-foreground">
              Start adding outfits to this collection from your wishlist
            </p>
            <Button
              className="bg-brand-crimson hover:bg-brand-crimson/90"
              onClick={() => navigate('/wishlist')}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add from Wishlist
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {collection.items.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <OutfitCard
                  id={item.id}
                  name={item.name}
                  image={item.image}
                  matchScore={item.matchScore}
                  likes={item.likes}
                  items={item.items}
                />

                {/* Remove Button */}
                <motion.div
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                  className="absolute right-2 top-2 z-10"
                >
                  <Button
                    size="icon"
                    variant="secondary"
                    className="h-8 w-8 rounded-full bg-white/90 shadow-lg hover:bg-white"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </motion.div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </MainLayout>
  )
}
