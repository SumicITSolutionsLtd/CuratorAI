import { useState, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import {
  Plus,
  Search,
  Filter,
  Grid3x3,
  List,
  Shirt,
  ShoppingBag,
  Watch,
  Sparkles,
  TrendingUp,
  Calendar,
  Loader2,
  X,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Badge } from '@/presentation/components/ui/badge'
import { Card } from '@/presentation/components/ui/card'
import { cn } from '@/shared/utils/cn'
import { Link, useNavigate } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/shared/store/hooks'
import {
  fetchWardrobe,
  fetchWardrobeStats,
  setSelectedCategory,
  setSearchQuery as setStoreSearchQuery,
} from '@/shared/store/slices/wardrobeSlice'
import { WardrobeItem } from '@/domain/entities/Wardrobe'
import { sortItems } from '@/shared/utils/wardrobeHelpers'
import { FilterDialog, FilterValues } from '@/presentation/components/wardrobe/FilterDialog'
import { SortMenu, SortOption } from '@/presentation/components/wardrobe/SortMenu'
import { setSortBy, setFilters } from '@/shared/store/slices/wardrobeSlice'
import { WardrobeGridSkeleton } from '@/presentation/components/ui/shimmer'

const formatLastWorn = (item: WardrobeItem): string => {
  const now = new Date()
  const updated = new Date(item.updatedAt)
  const diffDays = Math.floor((now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return '1 day ago'
  if (diffDays < 7) return `${diffDays} days ago`
  if (diffDays < 14) return '1 week ago'
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
  if (diffDays < 60) return '1 month ago'
  return `${Math.floor(diffDays / 30)} months ago`
}

export const WardrobePage = () => {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [localSearchQuery, setLocalSearchQuery] = useState('')
  const [filterDialogOpen, setFilterDialogOpen] = useState(false)

  const {
    items,
    stats,
    selectedCategory,
    searchQuery,
    sortBy,
    filters,
    isLoading,
    isLoadingStats,
    error,
  } = useAppSelector((state) => state.wardrobe)

  const { user } = useAppSelector((state) => state.auth)

  // Fetch wardrobe data on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchWardrobe(user.id))
      dispatch(fetchWardrobeStats(user.id))
    }
  }, [dispatch, user?.id])

  // Sync local search with store
  useEffect(() => {
    const debounce = setTimeout(() => {
      dispatch(setStoreSearchQuery(localSearchQuery))
    }, 300)
    return () => clearTimeout(debounce)
  }, [localSearchQuery, dispatch])

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    return {
      all: items.length,
      top: items.filter((item) => item.category === 'top').length,
      bottom: items.filter((item) => item.category === 'bottom').length,
      shoes: items.filter((item) => item.category === 'shoes').length,
      accessory: items.filter((item) => item.category === 'accessory').length,
      dress: items.filter((item) => item.category === 'dress').length,
      outerwear: items.filter((item) => item.category === 'outerwear').length,
      bag: items.filter((item) => item.category === 'bag').length,
    }
  }, [items])

  const categories = [
    {
      id: 'all' as const,
      name: 'All Items',
      icon: Grid3x3,
      count: categoryCounts.all,
      color: 'text-brand-crimson',
    },
    {
      id: 'top' as const,
      name: 'Tops',
      icon: Shirt,
      count: categoryCounts.top,
      color: 'text-brand-blue',
    },
    {
      id: 'bottom' as const,
      name: 'Bottoms',
      icon: ShoppingBag,
      count: categoryCounts.bottom,
      color: 'text-purple-500',
    },
    {
      id: 'dress' as const,
      name: 'Dresses',
      icon: ShoppingBag,
      count: categoryCounts.dress,
      color: 'text-pink-500',
    },
    {
      id: 'shoes' as const,
      name: 'Shoes',
      icon: Sparkles,
      count: categoryCounts.shoes,
      color: 'text-green-500',
    },
    {
      id: 'accessory' as const,
      name: 'Accessories',
      icon: Watch,
      count: categoryCounts.accessory,
      color: 'text-amber-500',
    },
    {
      id: 'outerwear' as const,
      name: 'Outerwear',
      icon: Shirt,
      count: categoryCounts.outerwear,
      color: 'text-indigo-500',
    },
    {
      id: 'bag' as const,
      name: 'Bags',
      icon: ShoppingBag,
      count: categoryCounts.bag,
      color: 'text-rose-500',
    },
  ]

  // Filter and search items
  const filteredItems = useMemo(() => {
    let filtered = [...items]

    // Apply category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory)
    }

    // Apply search
    if (searchQuery) {
      const lowerQuery = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.brand?.toLowerCase().includes(lowerQuery) ||
          item.color.toLowerCase().includes(lowerQuery) ||
          item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
      )
    }

    // Apply advanced filters
    if (filters.brand) {
      filtered = filtered.filter((item) => item.brand === filters.brand)
    }
    if (filters.color) {
      filtered = filtered.filter((item) =>
        item.color.toLowerCase().includes(filters.color!.toLowerCase())
      )
    }
    if (filters.season) {
      filtered = filtered.filter((item) =>
        item.attributes.some(
          (attr) =>
            attr.key === 'season' &&
            attr.value.toLowerCase().includes(filters.season!.toLowerCase())
        )
      )
    }
    if (filters.minPrice) {
      filtered = filtered.filter((item) => item.price && item.price >= filters.minPrice!)
    }
    if (filters.maxPrice) {
      filtered = filtered.filter((item) => item.price && item.price <= filters.maxPrice!)
    }

    // Apply sorting
    return sortItems(filtered, sortBy)
  }, [items, selectedCategory, searchQuery, sortBy, filters])

  const handleAddItem = () => {
    navigate('/wardrobe/add')
  }

  const handleClearSearch = () => {
    setLocalSearchQuery('')
    dispatch(setStoreSearchQuery(''))
  }

  const handleFilterApply = (newFilters: FilterValues) => {
    dispatch(setFilters(newFilters))
  }

  const handleSortChange = (newSort: SortOption) => {
    dispatch(setSortBy(newSort))
  }

  const activeFiltersCount = Object.values(filters).filter(Boolean).length

  if (error) {
    return (
      <MainLayout>
        <div className="flex h-96 items-center justify-center">
          <div className="text-center">
            <p className="text-lg font-semibold text-red-600">Error loading wardrobe</p>
            <p className="text-sm text-muted-foreground">{error}</p>
          </div>
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
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex-1">
            <h1 className="font-heading text-2xl font-bold text-brand-charcoal sm:text-3xl">
              My Wardrobe
            </h1>
            <p className="mt-1 text-xs text-muted-foreground sm:text-sm">
              Organize, track, and style your fashion collection
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/wardrobe/create-outfit" className="flex-1 sm:flex-none">
              <Button className="w-full bg-brand-blue hover:bg-brand-blue/90 sm:w-auto">
                <Sparkles className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Create Outfit</span>
                <span className="sm:hidden">Create</span>
              </Button>
            </Link>
            <Button
              onClick={handleAddItem}
              className="flex-1 bg-brand-crimson hover:bg-brand-crimson/90 sm:flex-none"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span className="hidden sm:inline">Add Item</span>
              <span className="sm:hidden">Add</span>
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="border-brand-crimson/20 p-4 transition-all hover:shadow-lg hover:shadow-brand-crimson/10">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-brand-crimson/10 p-3">
                  <Shirt className="h-5 w-5 text-brand-crimson" />
                </div>
                <div>
                  {isLoadingStats ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-brand-charcoal">
                        {stats?.totalItems || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Items</p>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="border-brand-blue/20 p-4 transition-all hover:shadow-lg hover:shadow-brand-blue/10">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-brand-blue/10 p-3">
                  <Sparkles className="h-5 w-5 text-brand-blue" />
                </div>
                <div>
                  {isLoadingStats ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-brand-charcoal">
                        {stats?.totalOutfits || 0}
                      </p>
                      <p className="text-xs text-muted-foreground">Outfits Created</p>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="border-brand-blue/20 p-4 transition-all hover:shadow-lg hover:shadow-brand-blue/10">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-brand-blue/10 p-3">
                  <TrendingUp className="h-5 w-5 text-brand-blue" />
                </div>
                <div>
                  {isLoadingStats ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-brand-charcoal">
                        ${Number(stats?.totalValue || 0).toFixed(0)}
                      </p>
                      <p className="text-xs text-muted-foreground">Total Value</p>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="border-brand-crimson/20 p-4 transition-all hover:shadow-lg hover:shadow-brand-crimson/10">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-brand-crimson/10 p-3">
                  <Calendar className="h-5 w-5 text-brand-crimson" />
                </div>
                <div>
                  {isLoadingStats ? (
                    <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                  ) : (
                    <>
                      <p className="text-2xl font-bold text-brand-charcoal">
                        {stats?.mostWornCategory || 'N/A'}
                      </p>
                      <p className="text-xs text-muted-foreground">Most Worn</p>
                    </>
                  )}
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {categories.map((category) => {
            const Icon = category.icon
            return (
              <motion.button
                key={category.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => dispatch(setSelectedCategory(category.id))}
                className={cn(
                  'flex items-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-all',
                  selectedCategory === category.id
                    ? 'bg-brand-crimson text-white shadow-lg shadow-brand-crimson/30'
                    : 'border bg-background hover:border-brand-crimson/30'
                )}
              >
                <Icon className="h-4 w-4" />
                <span>{category.name}</span>
                <Badge variant="secondary" className="ml-1">
                  {category.count}
                </Badge>
              </motion.button>
            )
          })}
        </div>

        {/* Search and View Controls */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search your wardrobe..."
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              className="pl-10 pr-10"
            />
            {localSearchQuery && (
              <button
                onClick={handleClearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Button variant="outline" size="icon" onClick={() => setFilterDialogOpen(true)}>
                <Filter className="h-4 w-4" />
              </Button>
              {activeFiltersCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-brand-crimson text-xs text-white">
                  {activeFiltersCount}
                </span>
              )}
            </div>
            <SortMenu currentSort={sortBy} onSortChange={handleSortChange} />
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

        {/* Loading State */}
        {isLoading && items.length === 0 && <WardrobeGridSkeleton count={8} />}

        {/* Empty State */}
        {!isLoading && filteredItems.length === 0 && (
          <div className="flex h-96 flex-col items-center justify-center">
            <Shirt className="h-16 w-16 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-semibold text-muted-foreground">
              {searchQuery ? 'No items found' : 'Your wardrobe is empty'}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'Add your first item to get started'}
            </p>
            {!searchQuery && (
              <Button onClick={handleAddItem} className="mt-6 bg-brand-crimson">
                <Plus className="mr-2 h-4 w-4" />
                Add Your First Item
              </Button>
            )}
          </div>
        )}

        {/* Wardrobe Items Grid */}
        {!isLoading && filteredItems.length > 0 && (
          <AnimatePresence mode="popLayout">
            <div
              className={cn(
                'grid gap-4',
                viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'
              )}
            >
              {filteredItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.02 }}
                >
                  <Link to={`/wardrobe/items/${item.id}`}>
                    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-brand-crimson/20">
                      {/* Image */}
                      <div className="relative aspect-[3/4] overflow-hidden bg-brand-beige">
                        <motion.img
                          src={item.images[0]}
                          alt={item.name}
                          className="h-full w-full object-cover"
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.3 }}
                        />
                        {/* Desktop hover overlay */}
                        <div className="absolute inset-0 hidden bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100 lg:block" />

                        {/* Quick Stats Overlay - Desktop (hover) */}
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          whileHover={{ opacity: 1, y: 0 }}
                          className="absolute bottom-2 left-2 right-2 hidden gap-2 lg:flex"
                        >
                          <Badge className="bg-white/90 text-brand-charcoal hover:bg-white">
                            Worn {item.timesWorn}×
                          </Badge>
                          <Badge className="bg-white/90 text-brand-charcoal hover:bg-white">
                            {formatLastWorn(item)}
                          </Badge>
                        </motion.div>

                        {/* Mobile Stats - Always visible */}
                        <div className="absolute bottom-2 left-2 right-2 flex gap-2 lg:hidden">
                          <Badge className="bg-white/95 text-brand-charcoal backdrop-blur-sm">
                            Worn {item.timesWorn}×
                          </Badge>
                          <Badge className="bg-white/95 text-brand-charcoal backdrop-blur-sm">
                            {formatLastWorn(item)}
                          </Badge>
                        </div>
                      </div>

                      {/* Item Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <h3 className="truncate font-semibold text-brand-charcoal">
                              {item.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {item.brand || 'No brand'}
                            </p>
                          </div>
                          <Badge variant="outline" className="shrink-0 text-xs capitalize">
                            {item.category}
                          </Badge>
                        </div>
                        <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                          <div
                            className="h-3 w-3 rounded-full border"
                            style={{
                              backgroundColor: item.color.includes('/')
                                ? undefined
                                : item.color.toLowerCase(),
                              background: item.color.includes('/')
                                ? 'linear-gradient(135deg, navy 50%, white 50%)'
                                : undefined,
                            }}
                          />
                          <span>{item.color}</span>
                          <span>•</span>
                          <span>
                            {item.attributes.find((attr) => attr.key === 'season')?.value ||
                              'All Season'}
                          </span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </AnimatePresence>
        )}
      </motion.div>

      {/* Filter Dialog */}
      <FilterDialog
        open={filterDialogOpen}
        onOpenChange={setFilterDialogOpen}
        onApply={handleFilterApply}
        currentFilters={filters}
        items={items}
      />
    </MainLayout>
  )
}
