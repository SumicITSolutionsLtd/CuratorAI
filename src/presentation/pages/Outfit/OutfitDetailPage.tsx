import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ArrowLeft,
  Download,
  Share2,
  Sparkles,
  ShoppingBag,
  Check,
  ExternalLink,
  RotateCw,
} from 'lucide-react'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import { Button } from '@/presentation/components/ui/button'
import { Badge } from '@/presentation/components/ui/badge'
import { Card } from '@/presentation/components/ui/card'
import { cn } from '@/shared/utils/cn'
import { showToast } from '@/shared/utils/toast'
import { mockOutfitDetail, swapAlternatives, trackSwapEvent } from '@/shared/mocks/outfitMockData'
import { StyleSwapDrawer, SwapAlternative } from '@/presentation/components/outfit/StyleSwapDrawer'
import type { OutfitItem, SellerType } from '@/shared/mocks/outfitMockData'

const sellerConfig: Record<
  SellerType,
  { icon: string; label: string; ctaText: string; description: string }
> = {
  curator: {
    icon: '✅',
    label: 'Curator Fulfilled',
    ctaText: 'Add to Bag',
    description: 'Curated and fulfilled by CuratorAI',
  },
  partner: {
    icon: '🤝',
    label: 'Partner Store',
    ctaText: 'Buy on Store',
    description: 'Available through our partner network',
  },
  external: {
    icon: '🌐',
    label: 'External Seller',
    ctaText: 'View on Store',
    description: 'Available from external retailer',
  },
}

export const OutfitDetailPage = () => {
  const navigate = useNavigate()
  const [outfit, setOutfit] = useState(mockOutfitDetail)
  const [selectedItemForSwap, setSelectedItemForSwap] = useState<OutfitItem | null>(null)
  const [swapDrawerOpen, setSwapDrawerOpen] = useState(false)

  const handleSwapItem = (itemId: string) => {
    const item = outfit.items.find((i) => i.id === itemId)
    if (item) {
      setSelectedItemForSwap(item)
      setSwapDrawerOpen(true)
      trackSwapEvent('open_swap_drawer', { outfitId: outfit.id, itemId })
    }
  }

  const handleSwapApplied = (alternative: SwapAlternative) => {
    if (!selectedItemForSwap) return

    // Update the outfit with the swapped item
    const updatedItems = outfit.items.map((item) => {
      if (item.id === selectedItemForSwap.id) {
        return {
          ...item,
          name: alternative.name,
          brand: alternative.brand,
          price: alternative.price,
          image: alternative.image,
          size: alternative.size || item.size,
          seller: alternative.seller,
          sellerName: alternative.sellerName,
        }
      }
      return item
    })

    const newTotalPrice = updatedItems.reduce((sum, item) => sum + item.price, 0)

    setOutfit({
      ...outfit,
      items: updatedItems,
      totalPrice: newTotalPrice,
    })

    trackSwapEvent('swap_applied', {
      outfitId: outfit.id,
      itemId: selectedItemForSwap.id,
      swapId: alternative.id,
    })

    showToast.success('Item Swapped!', `Updated to ${alternative.name}`)
  }

  const handleItemAction = (item: OutfitItem) => {
    const config = sellerConfig[item.seller]
    if (item.seller === 'curator') {
      showToast.addedToCart(item.name)
    } else {
      showToast.success(`Opening ${config.label}`, `Viewing ${item.name} on ${item.sellerName}`)
    }
  }

  const handleBuyOutfit = () => {
    showToast.addedToCart(`All items from ${outfit.name}`)
  }

  const handleDownloadLook = () => {
    showToast.success('Downloading Look', 'Your outfit is being prepared with watermark')
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    showToast.success('Link Copied!', 'Share this look with your friends')
  }

  const handleTrySimilar = () => {
    trackSwapEvent('try_similar_clicked', { outfitId: outfit.id })
    showToast.success('Finding Similar', 'Searching for similar looks...')
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
                <img
                  src={outfit.heroImage}
                  alt={outfit.name}
                  className="h-full w-full object-cover"
                />

                {/* Match Badge */}
                <div className="absolute right-3 top-3 sm:right-4 sm:top-4">
                  <Badge className="bg-green-500/95 px-2.5 py-1 text-white shadow-lg backdrop-blur-sm sm:px-3 sm:py-1.5">
                    <Sparkles className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="text-xs font-semibold sm:text-sm">
                      {outfit.matchScore}% Match
                    </span>
                  </Badge>
                </div>

                {/* Style Tags */}
                <div className="absolute bottom-3 left-3 right-3 flex flex-wrap gap-2 sm:bottom-4 sm:left-4 sm:right-4">
                  {outfit.styleTags.map((tag) => (
                    <Badge
                      key={tag}
                      className="bg-white/95 px-2.5 py-1 text-brand-charcoal shadow-md backdrop-blur-sm transition-all hover:scale-105 sm:px-3"
                    >
                      <span className="text-xs font-medium sm:text-sm">{tag}</span>
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            {/* Title and Description */}
            <div className="space-y-3 sm:space-y-4">
              <h1 className="font-heading text-3xl font-bold leading-tight text-brand-charcoal sm:text-4xl lg:text-5xl">
                {outfit.name}
              </h1>
              <p className="text-base leading-relaxed text-muted-foreground sm:text-lg lg:text-xl">
                {outfit.description}
              </p>
              <div className="flex flex-wrap gap-2 text-sm text-muted-foreground sm:gap-3 sm:text-base">
                <span className="flex items-center gap-1">
                  <strong className="font-semibold text-brand-charcoal">Occasion:</strong>{' '}
                  {outfit.occasion.slice(0, 2).join(', ')}
                  {outfit.occasion.length > 2 && ` +${outfit.occasion.length - 2}`}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="flex items-center gap-1">
                  <strong className="font-semibold text-brand-charcoal">Season:</strong>{' '}
                  {outfit.season}
                </span>
                <span className="hidden lg:inline">•</span>
                <span className="flex items-center gap-1">
                  <strong className="font-semibold text-brand-charcoal">Vibe:</strong> {outfit.vibe}
                </span>
              </div>
            </div>
          </motion.div>

          {/* Two Column Layout for Desktop */}
          <div className="grid gap-6 lg:grid-cols-3 lg:gap-8">
            {/* Main Content (Left 2/3 on desktop) */}
            <div className="space-y-6 sm:space-y-8 lg:col-span-2">
              {/* AI Stylist Insight */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="border-brand-blue/20 bg-gradient-to-br from-brand-blue/5 to-transparent p-5 shadow-sm transition-all hover:shadow-md sm:p-6">
                  <div className="mb-4 flex items-center gap-2.5">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue/10">
                      <Sparkles className="h-5 w-5 text-brand-blue" />
                    </div>
                    <h2 className="text-lg font-semibold text-brand-charcoal sm:text-xl">
                      AI Stylist Insight
                    </h2>
                  </div>
                  <p className="mb-4 text-sm text-muted-foreground sm:text-base">
                    Why this was recommended for you:
                  </p>
                  <ul className="space-y-2.5 sm:space-y-3">
                    {outfit.aiInsights.map((insight, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.05 }}
                        className="flex items-start gap-2.5 text-sm leading-relaxed text-muted-foreground sm:gap-3 sm:text-base"
                      >
                        <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-brand-blue/10">
                          <Check className="h-3 w-3 text-brand-blue" />
                        </div>
                        <span>{insight}</span>
                      </motion.li>
                    ))}
                  </ul>
                </Card>
              </motion.div>

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
                    Every piece, curated with intention. Tap to swap.
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4">
                  {outfit.items.map((item, index) => (
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
                            <img
                              src={item.image}
                              alt={item.name}
                              className="h-full w-full object-cover transition-transform hover:scale-110"
                            />
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
                                    {item.brand} • ${item.price.toFixed(2)} • Size {item.size}
                                  </p>
                                </div>
                                {/* Seller Badge */}
                                <Badge
                                  variant="secondary"
                                  className="w-fit shrink-0 text-xs sm:text-sm"
                                  title={sellerConfig[item.seller].description}
                                >
                                  <span className="mr-1">{sellerConfig[item.seller].icon}</span>
                                  <span className="hidden sm:inline">
                                    {sellerConfig[item.seller].label}
                                  </span>
                                  <span className="sm:hidden">
                                    {item.seller === 'curator'
                                      ? 'Curator'
                                      : item.seller === 'partner'
                                        ? 'Partner'
                                        : 'External'}
                                  </span>
                                </Badge>
                              </div>

                              {/* Stylist Note */}
                              <p className="text-xs italic leading-relaxed text-muted-foreground sm:text-sm">
                                "{item.stylistNote}"
                              </p>
                            </div>

                            {/* Item Actions */}
                            <div className="flex flex-col gap-2 sm:flex-row">
                              <Button
                                size="lg"
                                variant={item.seller === 'curator' ? 'default' : 'outline'}
                                className={cn(
                                  'flex-1 transition-all',
                                  item.seller === 'curator' &&
                                    'bg-brand-charcoal text-white hover:scale-[1.02] hover:bg-brand-charcoal/90'
                                )}
                                onClick={() => handleItemAction(item)}
                              >
                                {item.seller === 'curator' ? (
                                  <>
                                    <ShoppingBag className="mr-2 h-4 w-4" />
                                    {sellerConfig[item.seller].ctaText}
                                  </>
                                ) : (
                                  <>
                                    <ExternalLink className="mr-2 h-4 w-4" />
                                    {sellerConfig[item.seller].ctaText}
                                  </>
                                )}
                              </Button>

                              {/* Style Swap Button */}
                              {swapAlternatives[item.id] && (
                                <Button
                                  size="lg"
                                  variant="outline"
                                  className="flex-1 border-brand-blue text-brand-blue transition-all hover:scale-[1.02] hover:bg-brand-blue hover:text-white sm:flex-[0.6]"
                                  onClick={() => handleSwapItem(item.id)}
                                >
                                  <RotateCw className="mr-2 h-4 w-4" />
                                  Swap This
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
                          ${outfit.totalPrice.toFixed(2)}
                        </p>
                      </div>
                      <Badge className="bg-green-500 px-3 py-1.5 text-xs font-semibold text-white sm:text-sm">
                        {outfit.items.filter((i) => i.available).length}/{outfit.items.length}{' '}
                        Available
                      </Badge>
                    </div>

                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 gap-3 border-t pt-4">
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Items</p>
                        <p className="text-lg font-semibold text-brand-charcoal">
                          {outfit.items.length}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Avg Price</p>
                        <p className="text-lg font-semibold text-brand-charcoal">
                          ${(outfit.totalPrice / outfit.items.length).toFixed(0)}
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
              onClick={handleTrySimilar}
              className="flex-1 border-brand-blue text-brand-blue transition-all hover:scale-[1.02] hover:bg-brand-blue hover:text-white sm:flex-none"
            >
              <Sparkles className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Try Similar</span>
              <span className="sm:hidden">Similar</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Style Swap Drawer */}
      {selectedItemForSwap && (
        <StyleSwapDrawer
          open={swapDrawerOpen}
          onOpenChange={setSwapDrawerOpen}
          originalItem={{
            name: selectedItemForSwap.name,
            brand: selectedItemForSwap.brand,
            price: selectedItemForSwap.price,
            image: selectedItemForSwap.image,
          }}
          alternatives={swapAlternatives[selectedItemForSwap.id] || []}
          onSwap={handleSwapApplied}
        />
      )}
    </MainLayout>
  )
}
