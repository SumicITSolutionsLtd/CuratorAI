import { motion } from 'framer-motion'
import { Heart, Bookmark, Share2, ShoppingBag, Sparkles } from 'lucide-react'
import { Card } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { cn } from '@/shared/utils/cn'
import { useState } from 'react'

interface OutfitCardProps {
  id: string
  name: string
  imageUrl?: string
  items: { name: string; price: number }[]
  totalPrice: number
  matchScore: number
  tags: string[]
  likes: number
  isLiked?: boolean
  isSaved?: boolean
}

export const OutfitCard = ({
  name,
  imageUrl,
  items,
  totalPrice,
  matchScore,
  tags,
  likes,
  isLiked: initialLiked = false,
  isSaved: initialSaved = false,
}: OutfitCardProps) => {
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [isSaved, setIsSaved] = useState(initialSaved)
  const [isHovered, setIsHovered] = useState(false)

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
          {imageUrl ? (
            <img
              src={imageUrl}
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
                'backdrop-blur-sm font-bold',
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
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0"
          >
            <div className="absolute bottom-0 left-0 right-0 p-4">
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
                    <Heart
                      className={cn('h-4 w-4', isLiked && 'fill-current')}
                    />
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

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1"
                >
                  <Button
                    size="sm"
                    className="w-full bg-white text-brand-charcoal hover:bg-white/90"
                  >
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Shop Now
                  </Button>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="mb-2 font-semibold text-lg leading-tight">{name}</h3>

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
                • {item.name} - ${item.price}
              </p>
            ))}
            {items.length > 2 && (
              <p className="text-xs text-muted-foreground">
                +{items.length - 2} more items
              </p>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between border-t pt-3">
            <div>
              <p className="text-xs text-muted-foreground">Total Price</p>
              <p className="font-bold text-lg text-brand-crimson">${totalPrice}</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-muted-foreground">{likes} likes</p>
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}
