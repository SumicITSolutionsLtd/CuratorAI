import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import {
  Heart,
  BookOpen,
  Shirt,
  ShoppingBag,
  Plus,
  Folder,
  Grid3x3,
  List,
  MoreHorizontal,
  Trash2,
  Loader2,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Badge } from '@/presentation/components/ui/badge'
import { Card } from '@/presentation/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/presentation/components/ui/tabs'
import { OutfitCard } from '@/presentation/components/outfit/OutfitCard'
import { cn } from '@/shared/utils/cn'
import { showToast } from '@/shared/utils/toast'
import { useAppSelector } from '@/shared/hooks/useAppSelector'
import { useAppDispatch } from '@/shared/hooks/useAppDispatch'
import {
  fetchSavedOutfits,
  unsaveOutfit,
  likeOutfit,
  unlikeOutfit,
} from '@/shared/store/slices/outfitSlice'
import { fetchLikedLookbooks, unlikeLookbook } from '@/shared/store/slices/lookbookSlice'
import { useNavigate } from 'react-router-dom'

// Helper to format time ago
const formatTimeAgo = (date: Date): string => {
  const now = new Date()
  const diffMs = now.getTime() - new Date(date).getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  return `${diffDays}d ago`
}

export const WishlistPage = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { user } = useAppSelector((state) => state.auth)
  const { savedOutfits, isLoading: outfitsLoading } = useAppSelector((state) => state.outfit)
  const { likedLookbooks, isLoading: lookbooksLoading } = useAppSelector((state) => state.lookbook)

  const [selectedCollection, setSelectedCollection] = useState('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  const isLoading = outfitsLoading || lookbooksLoading

  // Fetch wishlist data on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchSavedOutfits({ userId: user.id, page: 1, limit: 20 }))
      dispatch(fetchLikedLookbooks({ page: 1, limit: 20 }))
    }
  }, [dispatch, user?.id])

  // Calculate collection counts
  const totalItems = savedOutfits.length + likedLookbooks.length
  const collections = [
    {
      id: 'all',
      name: 'All Items',
      icon: Heart,
      count: totalItems,
      color: 'text-brand-crimson',
    },
    {
      id: 'outfits',
      name: 'Outfits',
      icon: Shirt,
      count: savedOutfits.length,
      color: 'text-brand-blue',
    },
    {
      id: 'lookbooks',
      name: 'Lookbooks',
      icon: BookOpen,
      count: likedLookbooks.length,
      color: 'text-brand-blue',
    },
    { id: 'items', name: 'Items', icon: ShoppingBag, count: 0, color: 'text-brand-crimson' },
  ]

  // Transform wishlist outfits to match UI format
  const transformedOutfits = savedOutfits.map((outfit) => ({
    id: outfit.id,
    name: outfit.name,
    image: outfit.items[0]?.imageUrl || '',
    items: outfit.items.map((item) => ({
      name: item.name,
      brand: item.brand,
    })),
    matchScore: 0, // Wishlist outfits don't have match score
    price: outfit.totalPrice,
    likes: outfit.likes || 0,
    isLiked: outfit.isLiked,
    isSaved: true, // These are saved outfits
    savedAt: formatTimeAgo(outfit.createdAt),
  }))

  // Handle like/unlike outfit
  const handleLikeOutfit = async (outfitId: string | number, isNowLiked: boolean) => {
    if (!user?.id) {
      showToast.error('Sign in required', 'Please sign in to like outfits')
      return
    }

    try {
      if (isNowLiked) {
        await dispatch(likeOutfit({ userId: user.id, outfitId: String(outfitId) })).unwrap()
      } else {
        await dispatch(unlikeOutfit({ userId: user.id, outfitId: String(outfitId) })).unwrap()
      }
    } catch {
      showToast.error('Error', 'Failed to update like status')
    }
  }

  // Handle remove lookbook from liked
  const handleRemoveLookbook = async (lookbookId: string) => {
    if (!user?.id) return

    try {
      await dispatch(unlikeLookbook({ userId: user.id, lookbookId })).unwrap()
      showToast.success('Removed', 'Lookbook removed from wishlist')
    } catch {
      showToast.error('Error', 'Failed to remove lookbook')
    }
  }

  // Handle remove from wishlist
  const handleRemoveFromWishlist = async (outfitId: string) => {
    if (!user?.id) return

    try {
      await dispatch(unsaveOutfit({ userId: user.id, outfitId })).unwrap()
      showToast.success('Removed', 'Outfit removed from wishlist')
    } catch (error: unknown) {
      const errorMsg = error instanceof Error ? error.message : 'Could not remove outfit'
      showToast.error('Failed to remove', errorMsg)
    }
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-brand-charcoal">My Wishlist</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Your curated collection of favorite outfits and lookbooks
            </p>
          </div>
          <Button
            className="bg-brand-crimson hover:bg-brand-crimson/90"
            onClick={() => {
              showToast.success('Create Collection', 'Opening collection creator...')
              console.log('[Analytics] Create Collection clicked')
              // TODO: Navigate to /collections/create or show collection creation modal
            }}
          >
            <Plus className="mr-2 h-4 w-4" />
            New Collection
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {collections.map((collection) => {
            const Icon = collection.icon
            return (
              <motion.div
                key={collection.id}
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <Card
                  className={cn(
                    'cursor-pointer p-4 transition-all',
                    selectedCollection === collection.id
                      ? 'border-brand-crimson shadow-lg shadow-brand-crimson/20'
                      : 'hover:shadow-lg'
                  )}
                  onClick={() => setSelectedCollection(collection.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-gradient-to-br from-brand-crimson/10 to-brand-blue/10 p-3">
                      <Icon className={cn('h-5 w-5', collection.color)} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-brand-charcoal">{collection.count}</p>
                      <p className="text-xs text-muted-foreground">{collection.name}</p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )
          })}
        </div>

        {/* Custom Collections */}
        <Card className="bg-gradient-to-br from-brand-ivory to-brand-beige p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Folder className="h-5 w-5 text-brand-crimson" />
              <h2 className="font-semibold text-brand-charcoal">My Collections</h2>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                showToast.success('Create Collection', 'Opening collection creator...')
                console.log('[Analytics] Create Collection (My Collections) clicked')
                // TODO: Navigate to /collections/create or show collection creation modal
              }}
            >
              <Plus className="mr-2 h-4 w-4" />
              Create New
            </Button>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer rounded-lg bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-brand-charcoal">Summer Vacation</p>
                  <p className="mt-1 text-xs text-muted-foreground">12 items</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer rounded-lg bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-brand-charcoal">Fall Wardrobe</p>
                  <p className="mt-1 text-xs text-muted-foreground">8 items</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              className="cursor-pointer rounded-lg bg-white p-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-brand-charcoal">Work Essentials</p>
                  <p className="mt-1 text-xs text-muted-foreground">15 items</p>
                </div>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </motion.div>
          </div>
        </Card>

        {/* Wishlist Items Grid */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-xl font-bold text-brand-charcoal">Wishlist Outfits</h2>
            <div className="flex gap-2">
              <div className="flex rounded-lg border p-1">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('grid')}
                  className={cn(
                    'h-8 w-8',
                    viewMode === 'grid' && 'bg-brand-crimson hover:bg-brand-crimson/90'
                  )}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="icon"
                  onClick={() => setViewMode('list')}
                  className={cn(
                    'h-8 w-8',
                    viewMode === 'list' && 'bg-brand-crimson hover:bg-brand-crimson/90'
                  )}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <Tabs defaultValue="outfits" className="w-full">
            <TabsList>
              <TabsTrigger value="outfits">
                <Shirt className="mr-2 h-4 w-4" />
                Outfits
              </TabsTrigger>
              <TabsTrigger value="lookbooks">
                <BookOpen className="mr-2 h-4 w-4" />
                Lookbooks
              </TabsTrigger>
              <TabsTrigger value="items">
                <ShoppingBag className="mr-2 h-4 w-4" />
                Items
              </TabsTrigger>
            </TabsList>

            <TabsContent value="outfits" className="mt-6">
              {isLoading ? (
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-brand-crimson" />
                    <p className="text-lg font-semibold">Loading your wishlist...</p>
                    <p className="text-sm text-muted-foreground">This won't take long</p>
                  </div>
                </div>
              ) : transformedOutfits.length === 0 ? (
                <div className="py-12 text-center">
                  <Heart className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">Your wishlist is empty</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add outfits you love to your wishlist
                  </p>
                </div>
              ) : (
                <div
                  className={cn(
                    'grid gap-4',
                    viewMode === 'grid'
                      ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4'
                      : 'grid-cols-1'
                  )}
                >
                  {transformedOutfits.map((outfit, index) => (
                    <motion.div
                      key={outfit.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative"
                    >
                      <OutfitCard {...outfit} onLike={handleLikeOutfit} />

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
                          onClick={() => handleRemoveFromWishlist(outfit.id)}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </motion.div>

                      {/* Added Date */}
                      <div className="absolute bottom-2 left-2 z-10">
                        <Badge className="bg-white/90 text-xs text-brand-charcoal hover:bg-white">
                          Added {outfit.savedAt}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="lookbooks" className="mt-6">
              {lookbooksLoading ? (
                <div className="flex min-h-[400px] items-center justify-center">
                  <div className="text-center">
                    <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-brand-crimson" />
                    <p className="text-lg font-semibold">Loading lookbooks...</p>
                  </div>
                </div>
              ) : likedLookbooks.length === 0 ? (
                <div className="py-12 text-center">
                  <BookOpen className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                  <p className="text-muted-foreground">No lookbooks in your wishlist yet</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Like lookbooks to add them here
                  </p>
                </div>
              ) : (
                <div
                  className={cn(
                    'grid gap-4',
                    viewMode === 'grid'
                      ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4'
                      : 'grid-cols-1'
                  )}
                >
                  {likedLookbooks.map((lookbook, index) => (
                    <motion.div
                      key={lookbook.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group relative"
                    >
                      <Card
                        className="cursor-pointer overflow-hidden transition-all hover:shadow-lg"
                        onClick={() => navigate(`/lookbooks/${lookbook.id}`)}
                      >
                        <div className="relative aspect-[3/4] overflow-hidden">
                          {lookbook.coverImage ? (
                            <img
                              src={lookbook.coverImage}
                              alt={lookbook.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-beige to-brand-gray/10">
                              <BookOpen className="h-16 w-16 text-brand-gray/20" />
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-3">
                            <h3 className="mb-1 truncate text-sm font-bold text-white">
                              {lookbook.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-white/80">
                              <span>{lookbook.outfits.length} outfits</span>
                              <span>• {lookbook.likes} likes</span>
                            </div>
                          </div>
                        </div>
                      </Card>

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
                          onClick={(e) => {
                            e.stopPropagation()
                            handleRemoveLookbook(lookbook.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </motion.div>

                      {/* Added Date */}
                      <div className="absolute bottom-2 left-2 z-10">
                        <Badge className="bg-white/90 text-xs text-brand-charcoal hover:bg-white">
                          Added {formatTimeAgo(lookbook.createdAt)}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="items" className="mt-6">
              <div className="py-12 text-center">
                <ShoppingBag className="mx-auto mb-3 h-12 w-12 text-muted-foreground" />
                <p className="text-muted-foreground">No items in your wishlist yet</p>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </MainLayout>
  )
}
