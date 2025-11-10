import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft,
  Heart,
  Bookmark,
  Share2,
  MoreVertical,
  ShoppingCart,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
  Check,
  ExternalLink,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Scan,
  Camera,
  Upload,
  RotateCw,
  X,
} from 'lucide-react'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import { Button } from '@/presentation/components/ui/button'
import { Badge } from '@/presentation/components/ui/badge'
import { Card } from '@/presentation/components/ui/card'
import { Separator } from '@/presentation/components/ui/separator'
import { OutfitCard } from '@/presentation/components/outfit/OutfitCard'
import { cn } from '@/shared/utils/cn'
import { showToast } from '@/shared/utils/toast'

// Mock data for outfit detail
const mockOutfit = {
  id: '1',
  name: 'Summer Vibes Ensemble',
  description: 'Perfect for weekend brunch or shopping',
  images: [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
    'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800',
    'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800',
  ],
  matchScore: 95,
  totalPrice: 284.98,
  items: [
    {
      id: '1',
      name: 'White Cotton T-Shirt',
      brand: 'Zara',
      price: 29.99,
      size: 'M',
      available: true,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200',
    },
    {
      id: '2',
      name: 'Blue Denim Jeans',
      brand: 'H&M',
      price: 49.99,
      size: '30',
      available: true,
      image: 'https://images.unsplash.com/photo-1542272454315-7f6b8c2f0e3b?w=200',
    },
    {
      id: '3',
      name: 'White Sneakers',
      brand: 'Nike',
      price: 85.0,
      size: '9',
      available: true,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200',
    },
    {
      id: '4',
      name: 'Black Crossbody Bag',
      brand: 'Coach',
      price: 120.0,
      available: true,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200',
    },
  ],
  recommendations: [
    'Matches your "casual" style preference',
    'Within your $50-$200 budget',
    'Available in your size (M)',
    'Popular in your location',
    'Trending this season',
  ],
  tags: ['Summer', 'Casual', 'Floral'],
  likes: 234,
}

const similarOutfits = [
  {
    id: '2',
    name: 'Urban Street Style',
    imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400',
    items: [
      { name: 'Graphic Hoodie', price: 65 },
      { name: 'Denim Jacket', price: 98 },
    ],
    totalPrice: 248,
    matchScore: 92,
    tags: ['Street', 'Urban'],
    likes: 189,
  },
  {
    id: '3',
    name: 'Elegant Office Look',
    imageUrl: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400',
    items: [
      { name: 'Tailored Blazer', price: 145 },
      { name: 'Silk Blouse', price: 78 },
    ],
    totalPrice: 343,
    matchScore: 88,
    tags: ['Work', 'Formal'],
    likes: 156,
  },
  {
    id: '4',
    name: 'Boho Chic Outfit',
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400',
    items: [
      { name: 'Flowing Maxi Skirt', price: 68 },
      { name: 'Crochet Top', price: 45 },
    ],
    totalPrice: 168,
    matchScore: 90,
    tags: ['Boho', 'Casual'],
    likes: 201,
  },
]

export const OutfitDetailPage = () => {
  // const { outfitId } = useParams() // Will be used when connecting to real API
  const navigate = useNavigate()
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [feedback, setFeedback] = useState<'helpful' | 'not-helpful' | null>(null)
  const [showTryOn, setShowTryOn] = useState(false)

  const handleLike = () => {
    setIsLiked(!isLiked)
    if (!isLiked) {
      showToast.success('Added to your likes!', 'View all liked outfits in your profile')
    }
  }

  const handleSave = () => {
    setIsSaved(!isSaved)
    if (!isSaved) {
      showToast.success('Saved!', 'Added to your saved collection')
    }
  }

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href)
    showToast.success('Link copied!', 'Share this outfit with your friends')
  }

  const handleAddToCart = (itemName: string) => {
    showToast.addedToCart(itemName)
  }

  const handleAddAllToCart = () => {
    showToast.addedToCart(`All items from ${mockOutfit.name}`)
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % mockOutfit.images.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + mockOutfit.images.length) % mockOutfit.images.length)
  }

  return (
    <MainLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
            <ArrowLeft className="h-5 w-5" />
            Back
          </Button>

          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                className="gap-2 bg-brand-blue text-white hover:bg-brand-blue/90"
                onClick={() => setShowTryOn(true)}
              >
                <Scan className="h-5 w-5" />
                <span className="hidden sm:inline">Try On</span>
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant={isLiked ? 'default' : 'outline'}
                size="icon"
                onClick={handleLike}
                className={cn(isLiked && 'bg-brand-crimson hover:bg-brand-crimson/90')}
              >
                <Heart className={cn('h-5 w-5', isLiked && 'fill-current')} />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button
                variant={isSaved ? 'default' : 'outline'}
                size="icon"
                onClick={handleSave}
                className={cn(isSaved && 'bg-brand-blue hover:bg-brand-blue/90')}
              >
                <Bookmark className={cn('h-5 w-5', isSaved && 'fill-current')} />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Button variant="outline" size="icon" onClick={handleShare}>
                <Share2 className="h-5 w-5" />
              </Button>
            </motion.div>

            <Button variant="outline" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </motion.div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Images */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Main Image Carousel */}
            <Card className="overflow-hidden">
              <div className="relative aspect-[3/4] bg-gradient-to-br from-brand-beige/30 to-brand-gray/10">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={currentImageIndex}
                    src={mockOutfit.images[currentImageIndex]}
                    alt={mockOutfit.name}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="h-full w-full object-cover"
                  />
                </AnimatePresence>

                {/* Navigation Arrows */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white"
                >
                  <ChevronLeft className="h-6 w-6 text-brand-charcoal" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/90 p-2 shadow-lg backdrop-blur-sm transition-all hover:bg-white"
                >
                  <ChevronRight className="h-6 w-6 text-brand-charcoal" />
                </button>

                {/* Badges */}
                <div className="absolute left-4 top-4">
                  <Badge className="bg-white/90 text-brand-charcoal backdrop-blur-sm">
                    <ShoppingCart className="mr-1 h-3 w-3" />
                    Shoppable
                  </Badge>
                </div>
                <div className="absolute right-4 top-4">
                  <Badge className="bg-green-500/90 text-white backdrop-blur-sm">
                    <Sparkles className="mr-1 h-3 w-3" />
                    {mockOutfit.matchScore}% Match
                  </Badge>
                </div>

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black/50 px-3 py-1 text-xs text-white backdrop-blur-sm">
                  {currentImageIndex + 1} / {mockOutfit.images.length}
                </div>
              </div>
            </Card>

            {/* Thumbnails */}
            <div className="flex gap-2 overflow-x-auto pb-2">
              {mockOutfit.images.map((image, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentImageIndex(index)}
                  className={cn(
                    'relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all',
                    currentImageIndex === index
                      ? 'border-brand-crimson ring-2 ring-brand-crimson/20'
                      : 'border-transparent hover:border-brand-gray'
                  )}
                >
                  <img
                    src={image}
                    alt={`View ${index + 1}`}
                    className="h-full w-full object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Right Column - Details */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Title and Description */}
            <div>
              <h1 className="mb-2 text-3xl font-bold text-brand-charcoal">{mockOutfit.name}</h1>
              <p className="text-lg text-muted-foreground">{mockOutfit.description}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {mockOutfit.tags.map((tag) => (
                  <Badge key={tag} variant="outline">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Why Recommended */}
            <Card className="border-brand-blue/20 bg-gradient-to-br from-brand-blue/5 to-transparent p-6">
              <div className="mb-4 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-brand-blue" />
                <h3 className="text-lg font-semibold text-brand-charcoal">
                  Why This Was Recommended
                </h3>
              </div>
              <ul className="space-y-2">
                {mockOutfit.recommendations.map((reason, index) => (
                  <motion.li
                    key={index}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand-blue" />
                    <span>{reason}</span>
                  </motion.li>
                ))}
              </ul>
            </Card>

            <Separator />

            {/* Items List */}
            <div>
              <h3 className="mb-4 text-xl font-bold text-brand-charcoal">Items in This Outfit</h3>
              <div className="space-y-3">
                {mockOutfit.items.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.1 }}
                  >
                    <Card className="overflow-hidden transition-all hover:shadow-md">
                      <div className="flex gap-4 p-4">
                        <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gradient-to-br from-brand-beige/30 to-brand-gray/10">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="flex flex-1 flex-col justify-between">
                          <div>
                            <h4 className="font-semibold text-brand-charcoal">{item.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.brand} • ${item.price.toFixed(2)} • Size {item.size}
                              {item.available && (
                                <span className="ml-2 text-green-600">
                                  <Check className="inline h-3 w-3" /> Available
                                </span>
                              )}
                            </p>
                          </div>
                          <Button
                            size="sm"
                            className="w-fit bg-brand-crimson text-white hover:bg-brand-crimson/90"
                            onClick={() => handleAddToCart(item.name)}
                          >
                            <ShoppingCart className="mr-1.5 h-4 w-4" />
                            Buy Now
                          </Button>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Total and Add to Cart */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-between rounded-lg border bg-gradient-to-r from-brand-crimson/5 to-brand-blue/5 p-6"
            >
              <div>
                <p className="text-sm text-muted-foreground">Total Price</p>
                <p className="text-3xl font-bold text-brand-crimson">
                  ${mockOutfit.totalPrice.toFixed(2)}
                </p>
              </div>
              <Button
                size="lg"
                className="bg-brand-crimson text-white hover:bg-brand-crimson/90"
                onClick={handleAddAllToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add All to Cart
              </Button>
            </motion.div>

            <Separator />

            {/* Feedback */}
            <Card className="p-6">
              <h3 className="mb-4 font-semibold text-brand-charcoal">
                Was this recommendation helpful?
              </h3>
              <div className="flex gap-3">
                <Button
                  variant={feedback === 'helpful' ? 'default' : 'outline'}
                  className={cn(
                    'flex-1',
                    feedback === 'helpful' && 'bg-green-500 hover:bg-green-600'
                  )}
                  onClick={() => {
                    setFeedback('helpful')
                    showToast.success('Thanks!', 'Your feedback helps us improve')
                  }}
                >
                  <ThumbsUp className="mr-2 h-4 w-4" />
                  Yes
                </Button>
                <Button
                  variant={feedback === 'not-helpful' ? 'default' : 'outline'}
                  className={cn(
                    'flex-1',
                    feedback === 'not-helpful' && 'bg-red-500 hover:bg-red-600'
                  )}
                  onClick={() => {
                    setFeedback('not-helpful')
                    showToast.success('Thanks!', "We'll improve our recommendations")
                  }}
                >
                  <ThumbsDown className="mr-2 h-4 w-4" />
                  No
                </Button>
                <Button variant="outline" className="flex-1">
                  <MessageSquare className="mr-2 h-4 w-4" />
                  Feedback
                </Button>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Similar Outfits */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-brand-charcoal">
              Similar Outfits You Might Like
            </h2>
            <Link to="/home">
              <Button variant="ghost" className="gap-2 text-brand-blue">
                View All
                <ExternalLink className="h-4 w-4" />
              </Button>
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
            {similarOutfits.map((outfit) => (
              <OutfitCard
                key={outfit.id}
                id={outfit.id}
                name={outfit.name}
                imageUrl={outfit.imageUrl}
                items={outfit.items}
                totalPrice={outfit.totalPrice}
                matchScore={outfit.matchScore}
                tags={outfit.tags}
                likes={outfit.likes}
              />
            ))}
          </div>
        </motion.div>

        {/* Virtual Try-On Modal */}
        <AnimatePresence>
          {showTryOn && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
            >
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                onClick={() => setShowTryOn(false)}
              />

              {/* Modal */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative z-10 h-full max-h-[90vh] w-full max-w-5xl overflow-hidden"
              >
                <Card className="relative h-full w-full overflow-hidden">
                  {/* Close Button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-4 top-4 z-20 bg-white/90 backdrop-blur-sm hover:bg-white"
                    onClick={() => setShowTryOn(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>

                  {/* Scrollable Container */}
                  <div className="h-full overflow-y-auto overscroll-contain">
                    <div className="grid min-h-full md:h-full md:grid-cols-2 md:overflow-hidden">
                      {/* Left Side - Virtual Try-On View */}
                      <div className="relative flex flex-col items-center justify-center bg-gradient-to-br from-brand-beige/30 to-brand-gray/10 p-4 sm:p-8 md:overflow-y-auto">
                        <div className="mb-4 text-center sm:mb-6">
                          <h2 className="mb-2 text-xl font-bold text-brand-charcoal sm:text-2xl">
                            Virtual Try-On
                          </h2>
                          <p className="text-xs text-muted-foreground sm:text-sm">
                            See how this outfit looks on you
                          </p>
                        </div>

                        {/* Camera Preview Area */}
                        <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl border-4 border-brand-crimson/20 bg-gradient-to-br from-brand-ivory to-brand-beige shadow-2xl">
                          <div className="flex h-full items-center justify-center">
                            <div className="text-center">
                              <Camera className="mx-auto mb-4 h-12 w-12 text-brand-charcoal/30 sm:h-16 sm:w-16" />
                              <p className="mb-2 text-sm font-semibold text-brand-charcoal sm:text-base">
                                Camera not active
                              </p>
                              <p className="text-xs text-muted-foreground sm:text-sm">
                                Upload a photo or enable camera
                              </p>
                            </div>
                          </div>

                          {/* Outfit Overlay Badge */}
                          <div className="absolute left-4 top-4">
                            <Badge className="bg-brand-crimson text-white">
                              <Sparkles className="mr-1 h-3 w-3" />
                              AI Try-On
                            </Badge>
                          </div>
                        </div>

                        {/* Controls */}
                        <div className="mt-4 flex flex-wrap gap-2 sm:mt-6 sm:gap-3">
                          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                            <Upload className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Upload Photo</span>
                            <span className="sm:hidden">Upload</span>
                          </Button>
                          <Button variant="outline" size="sm" className="flex-1 sm:flex-none">
                            <Camera className="mr-2 h-4 w-4" />
                            <span className="hidden sm:inline">Use Camera</span>
                            <span className="sm:hidden">Camera</span>
                          </Button>
                          <Button variant="outline" size="icon" className="shrink-0">
                            <RotateCw className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Right Side - Outfit Details */}
                      <div className="flex flex-col bg-white p-4 sm:p-8 md:overflow-y-auto">
                        <div className="mb-4 sm:mb-6">
                          <h3 className="mb-2 text-lg font-bold text-brand-charcoal sm:text-xl">
                            {mockOutfit.name}
                          </h3>
                          <div className="mb-4 flex flex-wrap gap-2">
                            {mockOutfit.tags.map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="mb-4 flex items-center gap-2">
                            <Badge
                              className={cn(
                                'text-xs font-bold sm:text-sm',
                                'bg-green-500 text-white'
                              )}
                            >
                              <Sparkles className="mr-1 h-3 w-3" />
                              {mockOutfit.matchScore}% Match
                            </Badge>
                            <span className="text-xl font-bold text-brand-crimson sm:text-2xl">
                              ${mockOutfit.totalPrice.toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* Items List */}
                        <div className="mb-6">
                          <h4 className="mb-3 text-sm font-semibold text-brand-charcoal sm:text-base">
                            Outfit Includes:
                          </h4>
                          <div className="space-y-3">
                            {mockOutfit.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between rounded-lg border p-3"
                              >
                                <div>
                                  <p className="text-sm font-medium text-brand-charcoal">
                                    {item.name}
                                  </p>
                                  {item.brand && (
                                    <p className="text-xs text-muted-foreground">{item.brand}</p>
                                  )}
                                </div>
                                {item.price && (
                                  <p className="text-sm font-semibold text-brand-blue">
                                    ${item.price.toFixed(2)}
                                  </p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="space-y-3 pb-4 md:mt-auto md:pb-0">
                          <Button
                            className="w-full bg-brand-crimson hover:bg-brand-crimson/90"
                            size="lg"
                            onClick={handleAddAllToCart}
                          >
                            <ShoppingCart className="mr-2 h-5 w-5" />
                            Add to Cart
                          </Button>
                          <div className="grid grid-cols-3 gap-2">
                            <Button variant="outline" size="sm" onClick={handleLike}>
                              <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleSave}>
                              <Bookmark className={cn('h-4 w-4', isSaved && 'fill-current')} />
                            </Button>
                            <Button variant="outline" size="sm" onClick={handleShare}>
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MainLayout>
  )
}
