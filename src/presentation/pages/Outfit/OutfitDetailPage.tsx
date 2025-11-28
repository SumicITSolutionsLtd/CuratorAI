import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Download,
  Share2,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  Heart,
  Bookmark,
} from 'lucide-react'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import { Button } from '@/presentation/components/ui/button'
import { Badge } from '@/presentation/components/ui/badge'
import { Card } from '@/presentation/components/ui/card'
import { cn } from '@/shared/utils/cn'
import { useToast } from '@/presentation/components/ui/use-toast'
import { useAppSelector } from '@/shared/hooks/useAppSelector'
import { useAppDispatch } from '@/shared/hooks/useAppDispatch'
import {
  fetchOutfitById,
  likeOutfit,
  unlikeOutfit,
  saveOutfit,
  unsaveOutfit,
  clearSelectedOutfit,
} from '@/shared/store/slices/outfitSlice'
import { addToCart } from '@/shared/store/slices/cartSlice'
import { DetailPageSkeleton } from '@/presentation/components/ui/shimmer'

export const OutfitDetailPage = () => {
  const { outfitId } = useParams<{ outfitId: string }>()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const { user } = useAppSelector((state) => state.auth)
  const { selectedOutfit: outfit, isLoading, error } = useAppSelector((state) => state.outfit)

  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likesCount, setLikesCount] = useState(0)

  // Fetch outfit on mount
  useEffect(() => {
    if (outfitId) {
      dispatch(fetchOutfitById(outfitId))
    }
    return () => {
      dispatch(clearSelectedOutfit())
    }
  }, [dispatch, outfitId])

  // Sync local state with outfit data
  useEffect(() => {
    if (outfit) {
      setIsLiked(outfit.isLiked || false)
      setIsSaved(outfit.isSaved || false)
      setLikesCount(outfit.likes || 0)
    }
  }, [outfit])

  // Show error toast
  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: error,
        variant: 'destructive',
      })
    }
  }, [error, toast])

  const handleLike = async () => {
    if (!user?.id || !outfit) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to like outfits',
        variant: 'destructive',
      })
      return
    }

    try {
      if (isLiked) {
        await dispatch(unlikeOutfit({ userId: user.id, outfitId: outfit.id })).unwrap()
        setIsLiked(false)
        setLikesCount((prev) => Math.max(0, prev - 1))
      } else {
        await dispatch(likeOutfit({ userId: user.id, outfitId: outfit.id })).unwrap()
        setIsLiked(true)
        setLikesCount((prev) => prev + 1)
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update like status',
        variant: 'destructive',
      })
    }
  }

  const handleSave = async () => {
    if (!user?.id || !outfit) {
      toast({
        title: 'Sign in required',
        description: 'Please sign in to save outfits',
        variant: 'destructive',
      })
      return
    }

    try {
      if (isSaved) {
        await dispatch(unsaveOutfit({ userId: user.id, outfitId: outfit.id })).unwrap()
        setIsSaved(false)
        toast({
          title: 'Removed from saved',
          description: 'Outfit removed from your collection',
        })
      } else {
        await dispatch(saveOutfit({ userId: user.id, outfitId: outfit.id })).unwrap()
        setIsSaved(true)
        toast({
          title: 'Saved!',
          description: 'Outfit saved to your collection',
        })
      }
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to update save status',
        variant: 'destructive',
      })
    }
  }

  const handleAddToCart = async (item: NonNullable<typeof outfit>['items'][0]) => {
    if (!user?.id) {
      toast({
        title: 'Please log in',
        description: 'You need to be logged in to add items to cart',
        variant: 'destructive',
      })
      return
    }

    try {
      await dispatch(
        addToCart({
          userId: user.id,
          item: {
            outfitItemId: item.id,
            name: item.name,
            brand: item.brand || '',
            price: item.price || 0,
            currency: item.currency || 'USD',
            size: item.size,
            color: item.color || '',
            quantity: 1,
            imageUrl: item.imageUrl || '',
            productUrl: item.productUrl,
            inStock: item.inStock ?? true,
          },
        })
      ).unwrap()

      toast({
        title: 'Added to Cart',
        description: `${item.name} has been added to your cart`,
      })
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to add item to cart',
        variant: 'destructive',
      })
    }
  }

  const handleBuyOutfit = async () => {
    if (!user?.id || !outfit?.items?.length) {
      toast({
        title: 'Error',
        description: 'Unable to add items to cart',
        variant: 'destructive',
      })
      return
    }

    try {
      // Add each item to cart
      for (const item of outfit.items) {
        if (item.inStock !== false) {
          await dispatch(
            addToCart({
              userId: user.id,
              item: {
                outfitItemId: item.id,
                name: item.name,
                brand: item.brand || '',
                price: item.price || 0,
                currency: item.currency || 'USD',
                size: item.size,
                color: item.color || '',
                quantity: 1,
                imageUrl: item.imageUrl || '',
                productUrl: item.productUrl,
                inStock: item.inStock ?? true,
              },
            })
          ).unwrap()
        }
      }

      toast({
        title: 'Added to Cart',
        description: `All items from ${outfit.name} added to your cart`,
      })
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to add items to cart',
        variant: 'destructive',
      })
    }
  }

  const handleDownloadLook = () => {
    toast({
      title: 'Downloading Look',
      description: 'Your outfit is being prepared',
    })
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: 'Link Copied!',
      description: 'Share this look with your friends',
    })
  }

  // Calculate total price from items
  const totalPrice = outfit?.items?.reduce((sum, item) => sum + (item.price || 0), 0) || 0

  if (isLoading) {
    return (
      <MainLayout>
        <div className="mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
          <DetailPageSkeleton />
        </div>
      </MainLayout>
    )
  }

  if (!outfit) {
    return (
      <MainLayout>
        <div className="flex h-96 flex-col items-center justify-center">
          <h2 className="text-2xl font-bold text-muted-foreground">Outfit Not Found</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            The outfit you're looking for doesn't exist.
          </p>
          <Button onClick={() => navigate('/home')} className="mt-6">
            Back to Home
          </Button>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-7xl pb-24 sm:pb-28">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 flex items-center justify-between px-4 sm:mb-6 sm:px-6 lg:px-8"
        >
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="gap-2 hover:bg-brand-beige/50"
            size="lg"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="hidden sm:inline">Back</span>
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLike}
              className={cn(isLiked && 'text-red-500')}
            >
              <Heart className={cn('h-5 w-5', isLiked && 'fill-current')} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleSave}
              className={cn(isSaved && 'text-brand-blue')}
            >
              <Bookmark className={cn('h-5 w-5', isSaved && 'fill-current')} />
            </Button>
          </div>
        </motion.div>

        <div className="space-y-6 px-4 sm:space-y-8 sm:px-6 lg:px-8">
          {/* Hero Look */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4 sm:space-y-6"
          >
            <Card className="overflow-hidden shadow-lg">
              <div className="relative aspect-[3/4] bg-gradient-to-br from-brand-beige/30 to-brand-gray/10 sm:aspect-[4/5] lg:aspect-[16/9]">
                {outfit.items?.[0]?.imageUrl ? (
                  <img
                    src={outfit.items[0].imageUrl}
                    alt={outfit.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <ShoppingBag className="h-20 w-20 text-muted-foreground/30" />
                  </div>
                )}

                {/* Match Badge */}
                {outfit.confidenceScore > 0 && (
                  <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
                    <Badge className="bg-green-500/95 px-2.5 py-1 text-white shadow-lg backdrop-blur-sm sm:px-3 sm:py-1.5">
                      <Sparkles className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="text-xs font-semibold sm:text-sm">
                        {Math.round(outfit.confidenceScore * 100)}% Match
                      </span>
                    </Badge>
                  </div>
                )}

                {/* Style Tags */}
                {outfit.styleAttributes && outfit.styleAttributes.length > 0 && (
                  <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 sm:bottom-4 sm:left-4 sm:right-4">
                    {outfit.styleAttributes.slice(0, 4).map((tag) => (
                      <Badge
                        key={tag}
                        className="bg-white/95 px-2.5 py-1 text-brand-charcoal shadow-md backdrop-blur-sm transition-all hover:scale-105 sm:px-3"
                      >
                        <span className="text-xs font-medium sm:text-sm">{tag}</span>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </Card>

            {/* Title and Description */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="font-heading text-3xl font-bold leading-tight text-brand-charcoal sm:text-4xl lg:text-5xl">
                {outfit.name}
              </h1>
              {outfit.description && (
                <p className="text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
                  {outfit.description}
                </p>
              )}
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground sm:gap-3 sm:text-base">
                {outfit.occasion && (
                  <span className="flex items-center gap-1">
                    <strong className="font-semibold text-brand-charcoal">Occasion:</strong>{' '}
                    {outfit.occasion}
                  </span>
                )}
                {outfit.season && (
                  <>
                    <span className="hidden sm:inline">•</span>
                    <span className="flex items-center gap-1">
                      <strong className="font-semibold text-brand-charcoal">Season:</strong>{' '}
                      {outfit.season}
                    </span>
                  </>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  {likesCount} likes
                </span>
                <span className="flex items-center gap-1">
                  <Bookmark className="h-4 w-4" />
                  {outfit.saves || 0} saves
                </span>
              </div>
            </div>
          </motion.div>

          {/* Two Column Layout for Desktop */}
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            {/* Main Content (Left 2/3 on desktop) */}
            <div className="space-y-6 sm:space-y-8 lg:col-span-2">
              {/* The Breakdown */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="space-y-4 sm:space-y-5"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-brand-charcoal sm:text-3xl">
                    The Breakdown
                  </h2>
                  <p className="text-sm text-muted-foreground sm:text-base">
                    Every piece, curated with intention.
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {outfit.items?.map((item, index) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Card className="overflow-hidden transition-all hover:shadow-lg">
                        <div className="flex flex-col gap-4 p-4 sm:flex-row sm:gap-5 sm:p-5">
                          {/* Item Image */}
                          <div className="h-32 w-full flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-brand-beige/30 to-brand-gray/10 sm:h-28 sm:w-28 lg:h-32 lg:w-32">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="h-full w-full object-cover transition-transform hover:scale-110"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <ShoppingBag className="h-8 w-8 text-muted-foreground/30" />
                              </div>
                            )}
                          </div>

                          {/* Item Details */}
                          <div className="flex flex-1 flex-col gap-3">
                            <div className="space-y-2">
                              <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
                                <div className="flex-1 space-y-1">
                                  <h3 className="text-base font-semibold leading-tight text-brand-charcoal sm:text-lg">
                                    {item.name}
                                  </h3>
                                  <p className="text-sm text-muted-foreground sm:text-base">
                                    {item.brand}
                                    {Number(item.price) > 0 &&
                                      ` • $${Number(item.price).toFixed(2)}`}
                                    {item.size && ` • Size ${item.size}`}
                                  </p>
                                </div>
                                <Badge
                                  variant="secondary"
                                  className="w-fit shrink-0 text-xs capitalize sm:text-sm"
                                >
                                  {item.category}
                                </Badge>
                              </div>
                            </div>

                            {/* Item Actions */}
                            <div className="flex flex-col gap-2 sm:flex-row">
                              {item.inStock ? (
                                <Button
                                  size="lg"
                                  className="flex-1 bg-brand-charcoal text-white transition-all hover:scale-[1.02] hover:bg-brand-charcoal/90"
                                  onClick={() => handleAddToCart(item)}
                                >
                                  <ShoppingBag className="mr-2 h-4 w-4" />
                                  Add to Bag
                                </Button>
                              ) : (
                                <Badge variant="outline" className="text-muted-foreground">
                                  Out of Stock
                                </Badge>
                              )}

                              {item.productUrl && (
                                <Button
                                  size="lg"
                                  variant="outline"
                                  className="flex-1 sm:flex-[0.6]"
                                  onClick={() => window.open(item.productUrl, '_blank')}
                                >
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  View on Store
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Sidebar (Right 1/3 on desktop) */}
            <div className="space-y-6 lg:col-span-1">
              {/* Total Price Summary - Sticky on desktop */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="lg:sticky lg:top-24"
              >
                <Card className="border-brand-crimson/20 bg-gradient-to-br from-brand-crimson/5 to-brand-blue/5 p-5 shadow-md sm:p-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground sm:text-sm">
                          Total Look Investment
                        </p>
                        <p className="text-3xl font-bold text-brand-crimson sm:text-4xl">
                          ${totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <Badge className="bg-green-500 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm">
                        {outfit.items?.filter((i) => i.inStock).length || 0}/
                        {outfit.items?.length || 0} Available
                      </Badge>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 border-t pt-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Items</p>
                        <p className="text-lg font-semibold text-brand-charcoal">
                          {outfit.items?.length || 0}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Avg Price</p>
                        <p className="text-lg font-semibold text-brand-charcoal">
                          $
                          {outfit.items?.length ? (totalPrice / outfit.items.length).toFixed(0) : 0}
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Action Bar */}
      <div className="bg-white/98 fixed bottom-0 left-0 right-0 z-50 border-t shadow-2xl backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 py-3 sm:px-6 sm:py-4 lg:px-8">
          <div className="flex flex-wrap gap-2 sm:gap-3">
            <Button
              variant="outline"
              size="lg"
              onClick={handleDownloadLook}
              className="flex-1 transition-all hover:scale-[1.02] sm:flex-none"
            >
              <Download className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Download Look</span>
              <span className="sm:hidden">Download</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleShare}
              className="flex-1 transition-all hover:scale-[1.02] sm:flex-none"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
            <Button
              size="lg"
              className="flex-[2] bg-brand-charcoal text-white transition-all hover:scale-[1.02] hover:bg-brand-charcoal/90 sm:flex-[2] lg:flex-[1.5]"
              onClick={handleBuyOutfit}
            >
              <ShoppingBag className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
              <span className="font-semibold">Buy Outfit</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleLike}
              className={cn(
                'flex-1 transition-all hover:scale-[1.02] sm:flex-none',
                isLiked && 'border-red-500 text-red-500'
              )}
            >
              <Heart className={cn('mr-2 h-4 w-4', isLiked && 'fill-current')} />
              <span className="hidden sm:inline">{isLiked ? 'Liked' : 'Like'}</span>
            </Button>
          </div>
        </div>
      </div>
    </MainLayout>
  )
}
