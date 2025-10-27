import { motion, AnimatePresence } from 'framer-motion'
import {
  Heart,
  Bookmark,
  Share2,
  ShoppingBag,
  Sparkles,
  Scan,
  X,
  Camera,
  Image as ImageIcon,
  RotateCw,
} from 'lucide-react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { cn } from '@/shared/utils/cn'
import { useState } from 'react'
import { createPortal } from 'react-dom'

interface OutfitCardProps {
  id?: string | number
  name: string
  image?: string
  imageUrl?: string
  items: { name: string; price?: number; brand?: string }[]
  price?: number
  totalPrice?: number
  matchScore: number
  tags?: string[]
  likes: number
  isLiked?: boolean
  isSaved?: boolean
}

export const OutfitCard = ({
  name,
  image,
  imageUrl,
  items,
  price,
  totalPrice,
  matchScore,
  tags = [],
  likes,
  isLiked: initialLiked = false,
  isSaved: initialSaved = false,
}: OutfitCardProps) => {
  const displayImage = image || imageUrl
  const displayPrice = totalPrice || price || 0
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [isHovered, setIsHovered] = useState(false)
  const [showTryOn, setShowTryOn] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="group"
    >
      <Card className="overflow-hidden border-2 transition-all duration-300 hover:border-brand-crimson/50 hover:shadow-2xl hover:shadow-brand-crimson/10">
        {/* Image Container */}
        <div className="relative aspect-[3/4] overflow-hidden bg-gradient-to-br from-brand-beige/30 to-brand-gray/10">
          {displayImage ? (
            <img
              src={displayImage}
              alt={name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Sparkles className="h-16 w-16 text-brand-gray/20" />
            </div>
          )}

          {/* Match Score Badge */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute right-3 top-3"
          >
            <Badge
              className={cn(
                'font-bold backdrop-blur-sm',
                matchScore >= 90
                  ? 'bg-green-500/90 text-white'
                  : matchScore >= 75
                    ? 'bg-brand-blue/90 text-white'
                    : 'bg-brand-gray/90 text-white'
              )}
            >
              <Sparkles className="mr-1 h-3 w-3" />
              {matchScore}% Match
            </Badge>
          </motion.div>

          {/* Quick Actions Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/0"
          >
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="space-y-2">
                {/* Icon Actions Row */}
                <div className="flex gap-2">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      size="sm"
                      variant={isLiked ? 'default' : 'secondary'}
                      className={cn(
                        'backdrop-blur-sm',
                        isLiked && 'bg-brand-crimson hover:bg-brand-crimson/90'
                      )}
                      onClick={() => setIsLiked(!isLiked)}
                    >
                      <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button
                      size="sm"
                      variant={isSaved ? 'default' : 'secondary'}
                      className={cn(
                        'backdrop-blur-sm',
                        isSaved && 'bg-brand-blue hover:bg-brand-blue/90'
                      )}
                      onClick={() => setIsSaved(!isSaved)}
                    >
                      <Bookmark className={cn('h-4 w-4', isSaved && 'fill-current')} />
                    </Button>
                  </motion.div>

                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Button size="sm" variant="secondary" className="backdrop-blur-sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </motion.div>
                </div>

                {/* Primary Action Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      size="sm"
                      className="w-full bg-brand-blue text-white backdrop-blur-sm hover:bg-brand-blue/90"
                      onClick={() => setShowTryOn(true)}
                    >
                      <Scan className="mr-1.5 h-4 w-4" />
                      Try On
                    </Button>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      size="sm"
                      className="w-full bg-white text-brand-charcoal backdrop-blur-sm hover:bg-white/90"
                    >
                      <ShoppingBag className="mr-1.5 h-4 w-4" />
                      Shop
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="mb-2 text-lg font-semibold leading-tight">{name}</h3>

          {/* Tags */}
          <div className="mb-3 flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Items Preview */}
          <div className="mb-3 space-y-1">
            {items.slice(0, 2).map((item, idx) => (
              <p key={idx} className="text-xs text-muted-foreground">
                • {item.name}
                {item.price ? ` - $${item.price}` : ''}
              </p>
            ))}
            {items.length > 2 && (
              <p className="text-xs text-muted-foreground">+{items.length - 2} more items</p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t pt-3">
            <div>
              <p className="text-xs text-muted-foreground">Total Price</p>
              <p className="text-lg font-bold text-brand-crimson">${displayPrice}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{likes} likes</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Virtual Try-On Modal - Using Portal to render at body level */}
      {showTryOn &&
        createPortal(
          <AnimatePresence>
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
                className="relative z-10 h-full max-h-[90vh] w-full max-w-5xl"
              >
                <Card className="relative h-full w-full overflow-hidden">
                  {/* Close Button */}
                  <Button
                    size="icon"
                    variant="ghost"
                    className="absolute right-4 top-4 z-10 bg-white/90 backdrop-blur-sm hover:bg-white"
                    onClick={() => setShowTryOn(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>

                  <div className="grid h-full md:grid-cols-2">
                    {/* Left Side - Virtual Try-On View */}
                    <div className="relative flex flex-col items-center justify-center bg-gradient-to-br from-brand-beige/30 to-brand-gray/10 p-8">
                      <div className="mb-6 text-center">
                        <h2 className="mb-2 text-2xl font-bold text-brand-charcoal">
                          Virtual Try-On
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          See how this outfit looks on you
                        </p>
                      </div>

                      {/* Camera Preview Area */}
                      <div className="relative aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl border-4 border-brand-crimson/20 bg-gradient-to-br from-brand-ivory to-brand-beige shadow-2xl">
                        <div className="flex h-full items-center justify-center">
                          <div className="text-center">
                            <Camera className="mx-auto mb-4 h-16 w-16 text-brand-charcoal/30" />
                            <p className="mb-2 font-semibold text-brand-charcoal">
                              Camera not active
                            </p>
                            <p className="text-sm text-muted-foreground">
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
                      <div className="mt-6 flex gap-3">
                        <Button variant="outline" size="sm">
                          <ImageIcon className="mr-2 h-4 w-4" />
                          Upload Photo
                        </Button>
                        <Button variant="outline" size="sm">
                          <Camera className="mr-2 h-4 w-4" />
                          Use Camera
                        </Button>
                        <Button variant="outline" size="icon">
                          <RotateCw className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Right Side - Outfit Details */}
                    <div className="flex flex-col overflow-y-auto bg-white p-8">
                      <div className="mb-6">
                        <h3 className="mb-2 text-xl font-bold text-brand-charcoal">{name}</h3>
                        <div className="mb-4 flex flex-wrap gap-2">
                          {tags.map((tag) => (
                            <Badge key={tag} variant="outline">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <div className="mb-4 flex items-center gap-2">
                          <Badge
                            className={cn(
                              'font-bold',
                              matchScore >= 90
                                ? 'bg-green-500 text-white'
                                : matchScore >= 75
                                  ? 'bg-brand-blue text-white'
                                  : 'bg-brand-gray text-white'
                            )}
                          >
                            <Sparkles className="mr-1 h-3 w-3" />
                            {matchScore}% Match
                          </Badge>
                          <span className="text-2xl font-bold text-brand-crimson">
                            ${displayPrice}
                          </span>
                        </div>
                      </div>

                      {/* Items List */}
                      <div className="mb-6">
                        <h4 className="mb-3 font-semibold text-brand-charcoal">Outfit Includes:</h4>
                        <div className="space-y-3">
                          {items.map((item, idx) => (
                            <div
                              key={idx}
                              className="flex items-center justify-between rounded-lg border p-3"
                            >
                              <div>
                                <p className="font-medium text-brand-charcoal">{item.name}</p>
                                {item.brand && (
                                  <p className="text-xs text-muted-foreground">{item.brand}</p>
                                )}
                              </div>
                              {item.price && (
                                <p className="font-semibold text-brand-blue">${item.price}</p>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-auto space-y-3">
                        <Button
                          className="w-full bg-brand-crimson hover:bg-brand-crimson/90"
                          size="lg"
                        >
                          <ShoppingBag className="mr-2 h-5 w-5" />
                          Add to Cart
                        </Button>
                        <div className="grid grid-cols-3 gap-2">
                          <Button variant="outline" size="sm" onClick={() => setIsLiked(!isLiked)}>
                            <Heart className={cn('h-4 w-4', isLiked && 'fill-current')} />
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => setIsSaved(!isSaved)}>
                            <Bookmark className={cn('h-4 w-4', isSaved && 'fill-current')} />
                          </Button>
                          <Button variant="outline" size="sm">
                            <Share2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </motion.div>
  )
}
