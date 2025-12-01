import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import { ArrowLeft, X, Check, Loader2, Sparkles, Search } from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Label } from '@/presentation/components/ui/label'
import { Textarea } from '@/presentation/components/ui/textarea'
import { Card } from '@/presentation/components/ui/card'
import { Badge } from '@/presentation/components/ui/badge'
import { cn } from '@/shared/utils/cn'
import { useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks'
import { fetchWardrobe } from '@/shared/store/slices/wardrobeSlice'
import { createOutfit } from '@/shared/store/slices/outfitSlice'
import { WardrobeItem } from '@/domain/entities/Wardrobe'
import { OutfitItem } from '@/domain/entities/Outfit'
import { useToast } from '@/presentation/components/ui/use-toast'

export const CreateOutfitPage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { toast } = useToast()

  const { items, isLoading } = useAppSelector((state) => state.wardrobe)
  const { user } = useAppSelector((state) => state.auth)
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<WardrobeItem['category'] | 'all'>('all')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [outfitData, setOutfitData] = useState({
    name: '',
    description: '',
    tags: [] as string[],
    occasion: '',
  })

  const [currentTag, setCurrentTag] = useState('')

  useEffect(() => {
    if (items.length === 0 && user?.id) {
      dispatch(fetchWardrobe(user.id))
    }
  }, [dispatch, items.length, user?.id])

  const categories: Array<{ id: WardrobeItem['category'] | 'all'; name: string }> = [
    { id: 'all', name: 'All' },
    { id: 'top', name: 'Tops' },
    { id: 'bottom', name: 'Bottoms' },
    { id: 'dress', name: 'Dresses' },
    { id: 'shoes', name: 'Shoes' },
    { id: 'accessory', name: 'Accessories' },
    { id: 'outerwear', name: 'Outerwear' },
    { id: 'bag', name: 'Bags' },
  ]

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
      const matchesSearch =
        !searchQuery ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.brand?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.color.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  }, [items, selectedCategory, searchQuery])

  const selectedItemObjects = useMemo(() => {
    return items.filter((item) => selectedItems.includes(item.id))
  }, [items, selectedItems])

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  const handleAddTag = () => {
    if (currentTag.trim() && !outfitData.tags.includes(currentTag.trim())) {
      setOutfitData((prev) => ({ ...prev, tags: [...prev.tags, currentTag.trim()] }))
      setCurrentTag('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setOutfitData((prev) => ({ ...prev, tags: prev.tags.filter((t) => t !== tag) }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!outfitData.name.trim()) {
      toast({
        title: 'Missing Name',
        description: 'Please provide a name for your outfit.',
        variant: 'destructive',
      })
      return
    }

    if (selectedItems.length === 0) {
      toast({
        title: 'No Items Selected',
        description: 'Please select at least one item for your outfit.',
        variant: 'destructive',
      })
      return
    }

    if (!user?.id) {
      toast({
        title: 'Not Authenticated',
        description: 'Please log in to create an outfit.',
        variant: 'destructive',
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Transform wardrobe items to outfit items
      const outfitItems: OutfitItem[] = selectedItemObjects.map((item) => ({
        id: item.id,
        category: item.category as OutfitItem['category'],
        brand: item.brand || '',
        name: item.name,
        price: item.price || 0,
        currency: item.currency || 'USD',
        size: item.size,
        color: item.color,
        imageUrl: item.images?.[0] || '',
        productUrl: item.purchaseLink,
        inStock: true,
      }))

      // Calculate total price
      const totalPrice = outfitItems.reduce((sum, item) => sum + item.price, 0)

      const newOutfit = {
        userId: user.id,
        name: outfitData.name,
        description: outfitData.description || undefined,
        items: outfitItems,
        styleAttributes: outfitData.tags,
        occasion: outfitData.occasion || undefined,
        season: undefined,
        confidenceScore: 100,
        totalPrice,
        currency: 'USD',
        isPublic: false,
        tags: outfitData.tags,
      }

      await dispatch(createOutfit(newOutfit)).unwrap()

      toast({
        title: 'Outfit Created',
        description: `${outfitData.name} has been saved to your collection.`,
      })

      navigate('/wardrobe')
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error?.message || 'Failed to create outfit. Please try again.',
        variant: 'destructive',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/wardrobe')}
            className="shrink-0"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-heading text-2xl font-bold text-brand-charcoal sm:text-3xl">
              Create Outfit
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Select items from your wardrobe to create a new outfit
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Item Selection - Left Side */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">
                  Select Items ({selectedItems.length} selected)
                </h2>
              </div>

              {/* Search and Filter */}
              <div className="mb-4 space-y-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        'whitespace-nowrap',
                        selectedCategory === category.id &&
                          'bg-brand-crimson hover:bg-brand-crimson/90'
                      )}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Items Grid */}
              {isLoading ? (
                <div className="flex h-64 items-center justify-center">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-crimson" />
                </div>
              ) : filteredItems.length === 0 ? (
                <div className="flex h-64 flex-col items-center justify-center text-muted-foreground">
                  <p>No items found</p>
                  {searchQuery && <p className="text-sm">Try adjusting your search</p>}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                  {filteredItems.map((item) => {
                    const isSelected = selectedItems.includes(item.id)
                    return (
                      <motion.div
                        key={item.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <button
                          onClick={() => toggleItemSelection(item.id)}
                          className={cn(
                            'group relative w-full overflow-hidden rounded-lg border-2 transition-all',
                            isSelected
                              ? 'border-brand-crimson shadow-lg shadow-brand-crimson/20'
                              : 'border-transparent hover:border-brand-crimson/50'
                          )}
                        >
                          <div className="aspect-[3/4] overflow-hidden bg-brand-beige">
                            {item.images && item.images.length > 0 ? (
                              <img
                                src={item.images[0]}
                                alt={item.name}
                                className="h-full w-full object-cover transition-transform group-hover:scale-110"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Sparkles className="h-8 w-8 text-muted-foreground/30" />
                              </div>
                            )}
                          </div>

                          {/* Selection Indicator */}
                          <AnimatePresence>
                            {isSelected && (
                              <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-brand-crimson text-white shadow-lg"
                              >
                                <Check className="h-5 w-5" />
                              </motion.div>
                            )}
                          </AnimatePresence>

                          {/* Item Info */}
                          <div className="p-2">
                            <p className="truncate text-xs font-medium">{item.name}</p>
                            <p className="truncate text-xs text-muted-foreground">
                              {item.brand || 'No brand'}
                            </p>
                          </div>
                        </button>
                      </motion.div>
                    )
                  })}
                </div>
              )}
            </Card>
          </div>

          {/* Outfit Details - Right Side */}
          <div className="lg:col-span-1">
            <form onSubmit={handleSubmit} className="sticky top-6 space-y-4">
              {/* Selected Items Preview */}
              {selectedItemObjects.length > 0 && (
                <Card className="p-4">
                  <h3 className="mb-3 text-sm font-semibold">Selected Items</h3>
                  <div className="space-y-2">
                    {selectedItemObjects.map((item) => (
                      <div key={item.id} className="flex items-center gap-2 rounded-lg border p-2">
                        {item.images && item.images.length > 0 ? (
                          <img
                            src={item.images[0]}
                            alt={item.name}
                            className="h-12 w-12 rounded object-cover"
                          />
                        ) : (
                          <div className="flex h-12 w-12 items-center justify-center rounded bg-muted">
                            <Sparkles className="h-4 w-4 text-muted-foreground" />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-xs font-medium">{item.name}</p>
                          <p className="truncate text-xs capitalize text-muted-foreground">
                            {item.category}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleItemSelection(item.id)}
                          className="shrink-0 rounded-full p-1 hover:bg-muted"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {/* Outfit Details Form */}
              <Card className="p-4">
                <h3 className="mb-4 text-sm font-semibold">Outfit Details</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">
                      Outfit Name <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="name"
                      value={outfitData.name}
                      onChange={(e) => setOutfitData({ ...outfitData, name: e.target.value })}
                      placeholder="e.g., Summer Brunch Look"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="occasion">Occasion</Label>
                    <Input
                      id="occasion"
                      value={outfitData.occasion}
                      onChange={(e) => setOutfitData({ ...outfitData, occasion: e.target.value })}
                      placeholder="e.g., Casual, Work, Date Night"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={outfitData.description}
                      onChange={(e) =>
                        setOutfitData({ ...outfitData, description: e.target.value })
                      }
                      placeholder="Describe your outfit..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Tags</Label>
                    <div className="flex gap-2">
                      <Input
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyPress={(e) =>
                          e.key === 'Enter' && (e.preventDefault(), handleAddTag())
                        }
                        placeholder="Add a tag..."
                        className="flex-1"
                      />
                      <Button type="button" variant="outline" size="sm" onClick={handleAddTag}>
                        Add
                      </Button>
                    </div>
                    {outfitData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {outfitData.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="gap-1">
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-1 hover:text-destructive"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate('/wardrobe')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || selectedItems.length === 0}
                  className="flex-1 bg-brand-crimson hover:bg-brand-crimson/90"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Create Outfit
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>
    </MainLayout>
  )
}
