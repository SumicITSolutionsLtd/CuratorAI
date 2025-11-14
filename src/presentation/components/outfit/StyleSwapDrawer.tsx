import { useState } from 'react'
import { motion } from 'framer-motion'
import { X, Check, TrendingUp, DollarSign, Sparkles, Loader2 } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Badge } from '@/presentation/components/ui/badge'
import { Card } from '@/presentation/components/ui/card'
import { cn } from '@/shared/utils/cn'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/presentation/components/ui/sheet'

export type SwapCategory =
  | 'cheaper'
  | 'same-brand'
  | 'similar-vibe'
  | 'available-size'
  | 'trending'
  | 'better-color'
  | 'higher-quality'

export interface SwapAlternative {
  id: string
  name: string
  brand: string
  price: number
  image: string
  size?: string
  seller: 'curator' | 'partner' | 'external'
  sellerName?: string
  matchScore: number
  reason: string
  category: SwapCategory[]
}

interface StyleSwapDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  originalItem: {
    name: string
    brand: string
    price: number
    image: string
  }
  alternatives: SwapAlternative[]
  onSwap: (alternative: SwapAlternative) => void
  isLoading?: boolean
}

const categoryLabels: Record<SwapCategory, { label: string; icon: typeof DollarSign }> = {
  cheaper: { label: 'Better Price', icon: DollarSign },
  'same-brand': { label: 'Same Brand', icon: Check },
  'similar-vibe': { label: 'Similar Vibe', icon: Sparkles },
  'available-size': { label: 'In Your Size', icon: Check },
  trending: { label: 'Trending', icon: TrendingUp },
  'better-color': { label: 'Better Match', icon: Sparkles },
  'higher-quality': { label: 'Premium', icon: Sparkles },
}

export const StyleSwapDrawer = ({
  open,
  onOpenChange,
  originalItem,
  alternatives,
  onSwap,
  isLoading = false,
}: StyleSwapDrawerProps) => {
  const [selectedAlt, setSelectedAlt] = useState<string | null>(null)

  const handleSwap = (alt: SwapAlternative) => {
    setSelectedAlt(alt.id)
    setTimeout(() => {
      onSwap(alt)
      onOpenChange(false)
      setSelectedAlt(null)
    }, 300)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[90vh] p-0">
        <div className="flex h-full flex-col">
          <SheetHeader className="border-b p-6">
            <div className="flex items-start justify-between">
              <div>
                <SheetTitle className="text-2xl">Swap the {originalItem.name}</SheetTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  {alternatives.length} better matches found
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
          </SheetHeader>

          {/* Original Item */}
          <div className="border-b bg-muted/30 p-4">
            <p className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
              Current Item
            </p>
            <div className="flex gap-3">
              <img
                src={originalItem.image}
                alt={originalItem.name}
                className="h-16 w-16 rounded-lg object-cover"
              />
              <div>
                <p className="font-semibold text-brand-charcoal">{originalItem.name}</p>
                <p className="text-sm text-muted-foreground">
                  {originalItem.brand} • ${originalItem.price.toFixed(2)}
                </p>
              </div>
            </div>
          </div>

          {/* Alternatives List */}
          <div className="flex-1 overflow-y-auto p-4">
            {isLoading ? (
              <div className="flex h-64 items-center justify-center">
                <div className="text-center">
                  <Loader2 className="mx-auto h-8 w-8 animate-spin text-brand-crimson" />
                  <p className="mt-3 text-sm text-muted-foreground">
                    Fetching better matches in your size...
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {alternatives.map((alt, index) => (
                  <motion.div
                    key={alt.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={cn(
                        'overflow-hidden transition-all hover:shadow-md',
                        selectedAlt === alt.id && 'ring-2 ring-brand-crimson'
                      )}
                    >
                      <div className="flex gap-4 p-4">
                        <img
                          src={alt.image}
                          alt={alt.name}
                          className="h-24 w-24 rounded-lg object-cover"
                        />
                        <div className="flex flex-1 flex-col">
                          <div className="mb-2 flex items-start justify-between gap-2">
                            <div className="flex-1">
                              <p className="font-semibold text-brand-charcoal">{alt.name}</p>
                              <p className="text-sm text-muted-foreground">{alt.brand}</p>
                            </div>
                            <Badge
                              className={cn(
                                alt.matchScore >= 95
                                  ? 'bg-green-500'
                                  : alt.matchScore >= 85
                                    ? 'bg-brand-blue'
                                    : 'bg-gray-500',
                                'text-white'
                              )}
                            >
                              {alt.matchScore}% Match
                            </Badge>
                          </div>

                          <p className="mb-2 text-xs text-muted-foreground">{alt.reason}</p>

                          <div className="mb-3 flex flex-wrap gap-1">
                            {alt.category.slice(0, 3).map((cat) => {
                              const { label, icon: Icon } = categoryLabels[cat]
                              return (
                                <Badge key={cat} variant="secondary" className="text-xs">
                                  <Icon className="mr-1 h-3 w-3" />
                                  {label}
                                </Badge>
                              )
                            })}
                          </div>

                          <div className="flex items-center justify-between gap-3">
                            <div>
                              <p className="text-lg font-bold text-brand-crimson">
                                ${alt.price.toFixed(2)}
                              </p>
                              {alt.price < originalItem.price && (
                                <p className="text-xs text-green-600">
                                  Save ${(originalItem.price - alt.price).toFixed(2)}
                                </p>
                              )}
                            </div>
                            <Button
                              onClick={() => handleSwap(alt)}
                              disabled={selectedAlt === alt.id}
                              className={cn(
                                'bg-brand-crimson hover:bg-brand-crimson/90',
                                selectedAlt === alt.id && 'bg-green-500 hover:bg-green-600'
                              )}
                            >
                              {selectedAlt === alt.id ? (
                                <>
                                  <Check className="mr-2 h-4 w-4" />
                                  Swapped!
                                </>
                              ) : (
                                'Swap This'
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
