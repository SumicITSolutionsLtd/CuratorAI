import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Sparkles,
  TrendingUp,
  Palette,
  Calendar,
  MapPin,
  Zap,
  SlidersHorizontal,
  Settings2,
  X,
} from 'lucide-react'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import { OutfitGrid } from '@/presentation/components/outfit/OutfitGrid'
import { FilterPanel } from '@/presentation/components/outfit/FilterPanel'
import { ControlPanel } from '@/presentation/components/outfit/ControlPanel'
import { Card } from '@/presentation/components/ui/card'
import { Button } from '@/presentation/components/ui/button'
import { Badge } from '@/presentation/components/ui/badge'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/presentation/components/ui/sheet'
import { OutfitGridSkeleton, StatsCardSkeleton } from '@/presentation/components/ui/shimmer'
import { showToast } from '@/shared/utils/toast'
import { useAppSelector } from '@/shared/hooks/useAppSelector'
import { useAppDispatch } from '@/shared/hooks/useAppDispatch'
import { fetchRecommendations } from '@/shared/store/slices/outfitSlice'

export const HomePage = () => {
  const dispatch = useAppDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { user } = useAppSelector((state) => state.auth)
  const { recommendations, isLoading } = useAppSelector((state) => state.outfit)

  const [filterOpen, setFilterOpen] = useState(false)
  const [controlOpen, setControlOpen] = useState(false)

  // Get search query from URL
  const searchQuery = searchParams.get('search') || ''

  // Fetch recommendations on mount
  useEffect(() => {
    if (user?.id) {
      dispatch(fetchRecommendations({ userId: user.id, page: 1, limit: 12 }))
    }
  }, [dispatch, user?.id])

  // Clear search
  const handleClearSearch = () => {
    setSearchParams({})
  }

  // Transform recommendations to match OutfitGrid expected format
  // Note: Backend returns Outfit[] directly, not OutfitRecommendation[]
  const allOutfits = recommendations.map((outfit: any) => ({
    id: outfit.id,
    name: outfit.title || outfit.name || 'Untitled Outfit',
    imageUrl: outfit.main_image || outfit.thumbnail || '',
    items:
      outfit.items?.map((item: any) => ({
        name: item.name || item.title,
        price: item.price || 0,
        brand: item.brand || '',
      })) || [],
    totalPrice: outfit.items?.reduce((sum: number, item: any) => sum + (item.price || 0), 0) || 0,
    matchScore: outfit.match_score || 85, // Default score since backend doesn't provide
    tags: outfit.tags || outfit.style_tags || [],
    likes: outfit.likes_count || 0,
  }))

  // Filter outfits based on search query
  const outfits = useMemo(() => {
    if (!searchQuery) return allOutfits

    const lowerQuery = searchQuery.toLowerCase()
    return allOutfits.filter(
      (outfit) =>
        outfit.name.toLowerCase().includes(lowerQuery) ||
        outfit.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery)) ||
        outfit.items.some(
          (item: any) =>
            item.name?.toLowerCase().includes(lowerQuery) ||
            item.brand?.toLowerCase().includes(lowerQuery)
        )
    )
  }, [allOutfits, searchQuery])

  return (
    <MainLayout>
      <div className="space-y-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-2"
        >
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold">
              Good morning, {user?.fullName?.split(' ')[0] || 'there'}!
            </h1>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              ☀️
            </motion.div>
          </div>
          <p className="text-muted-foreground">
            {isLoading ? (
              'Loading your perfect matches...'
            ) : (
              <>
                We've found{' '}
                <span className="font-semibold text-brand-crimson">
                  {outfits.length} perfect matches
                </span>{' '}
                for you today
              </>
            )}
          </p>
        </motion.div>

        {/* Search Results Banner */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center justify-between rounded-lg bg-brand-blue/10 px-4 py-3"
          >
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Showing results for:</span>
              <Badge variant="secondary" className="bg-brand-blue/20 text-brand-blue">
                "{searchQuery}"
              </Badge>
              <span className="text-sm text-muted-foreground">
                ({outfits.length} {outfits.length === 1 ? 'result' : 'results'})
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClearSearch}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="mr-1 h-4 w-4" />
              Clear
            </Button>
          </motion.div>
        )}

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {isLoading && outfits.length === 0 ? (
            <>
              <StatsCardSkeleton />
              <StatsCardSkeleton />
              <StatsCardSkeleton />
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="rounded-lg border bg-gradient-to-br from-brand-crimson/10 to-brand-crimson/5 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">New Recommendations</p>
                    <p className="text-2xl font-bold">{outfits.length}</p>
                  </div>
                  <Sparkles className="h-8 w-8 text-brand-crimson" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-lg border bg-gradient-to-br from-brand-blue/10 to-brand-blue/5 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Trending Now</p>
                    <p className="text-2xl font-bold">
                      {outfits.filter((o) => o.tags.includes('Trending')).length || 8}
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-brand-blue" />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="rounded-lg border bg-brand-beige/40 p-4"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">High Match Rate</p>
                    <p className="text-2xl font-bold">
                      {outfits.length > 0
                        ? Math.round(
                            outfits.reduce((sum, o) => sum + o.matchScore, 0) / outfits.length
                          )
                        : 95}
                      %
                    </p>
                  </div>
                  <div className="text-3xl">✨</div>
                </div>
              </motion.div>
            </>
          )}
        </div>

        {/* Welcome Back Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="p-6">
            <div className="mb-4">
              <h2 className="mb-1 flex items-center gap-2 text-xl font-bold">
                Welcome back{' '}
                <motion.span
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 0.5, delay: 0.5, repeat: 3 }}
                >
                  👋
                </motion.span>
              </h2>
              <p className="text-sm text-muted-foreground">
                Pick a starting point — CuratorAI will do the rest.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  showToast.success(
                    'Quick Style Loading...',
                    'Generating instant outfit recommendations'
                  )
                  console.log('[Analytics] Quick Style clicked')
                }}
                className="group rounded-lg border bg-gradient-to-br from-brand-ivory to-white p-4 text-left transition-all hover:border-brand-crimson hover:shadow-md"
              >
                <Zap className="mb-2 h-6 w-6 text-brand-crimson" />
                <h3 className="mb-1 font-semibold text-brand-charcoal">Quick Style</h3>
                <p className="text-xs text-muted-foreground">1-tap outfits for today</p>
              </motion.button>

              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  showToast.success('Color Mood Opening...', 'Pick your palette and vibe')
                  console.log('[Analytics] Color Mood clicked')
                }}
                className="group rounded-lg border bg-gradient-to-br from-brand-ivory to-white p-4 text-left transition-all hover:border-brand-blue hover:shadow-md"
              >
                <Palette className="mb-2 h-6 w-6 text-brand-blue" />
                <h3 className="mb-1 font-semibold text-brand-charcoal">Color Mood</h3>
                <p className="text-xs text-muted-foreground">Pick a palette & vibe</p>
              </motion.button>

              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  showToast.success('Event Ready Loading...', 'Finding looks for your occasion')
                  console.log('[Analytics] Event Ready clicked')
                }}
                className="group rounded-lg border bg-gradient-to-br from-brand-ivory to-white p-4 text-left transition-all hover:border-brand-crimson hover:shadow-md"
              >
                <Calendar className="mb-2 h-6 w-6 text-brand-crimson" />
                <h3 className="mb-1 font-semibold text-brand-charcoal">Event Ready</h3>
                <p className="text-xs text-muted-foreground">AI looks by occasion</p>
              </motion.button>

              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  showToast.success(
                    'Local Trends Loading...',
                    "Discovering what's trending near you"
                  )
                  console.log('[Analytics] Local Trends clicked')
                }}
                className="group rounded-lg border bg-gradient-to-br from-brand-ivory to-white p-4 text-left transition-all hover:border-brand-crimson hover:shadow-md"
              >
                <MapPin className="mb-2 h-6 w-6 text-brand-blue" />
                <h3 className="mb-1 font-semibold text-brand-charcoal">Local Trends</h3>
                <p className="text-xs text-muted-foreground">What's trending near you</p>
              </motion.button>
            </div>
          </Card>
        </motion.div>

        {/* Main Content - Three Column Layout (Desktop) / Mobile with Drawers */}
        <div className="xl:grid xl:grid-cols-[240px_1fr_280px] xl:gap-4">
          {/* Left: Filters (Desktop Only) */}
          <div className="hidden xl:block">
            <div className="sticky top-6 self-start">
              <FilterPanel />
            </div>
          </div>

          {/* Center: Outfit Grid */}
          <div className="relative">
            {isLoading && outfits.length === 0 ? (
              <OutfitGridSkeleton count={6} />
            ) : (
              <OutfitGrid outfits={outfits} />
            )}
          </div>

          {/* Right: Controls (Desktop Only) */}
          <div className="hidden xl:block">
            <div className="sticky top-6 self-start">
              <ControlPanel />
            </div>
          </div>
        </div>

        {/* Mobile Floating Action Buttons */}
        <div className="fixed bottom-24 right-4 z-40 flex flex-col gap-3 xl:hidden">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="icon"
              className="h-14 w-14 rounded-full bg-brand-crimson shadow-lg hover:bg-brand-crimson/90"
              onClick={() => setFilterOpen(true)}
            >
              <SlidersHorizontal className="h-6 w-6" />
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              size="icon"
              className="h-14 w-14 rounded-full bg-brand-blue shadow-lg hover:bg-brand-blue/90"
              onClick={() => setControlOpen(true)}
            >
              <Settings2 className="h-6 w-6" />
            </Button>
          </motion.div>
        </div>

        {/* Mobile Filters Sheet */}
        <Sheet open={filterOpen} onOpenChange={setFilterOpen}>
          <SheetContent side="left" className="w-[300px] overflow-y-auto sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>Filters</SheetTitle>
              <SheetDescription>Refine your outfit recommendations</SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <FilterPanel />
            </div>
          </SheetContent>
        </Sheet>

        {/* Mobile Controls Sheet */}
        <Sheet open={controlOpen} onOpenChange={setControlOpen}>
          <SheetContent side="right" className="w-[300px] overflow-y-auto sm:w-[400px]">
            <SheetHeader>
              <SheetTitle>AI Controls</SheetTitle>
              <SheetDescription>Customize your recommendations</SheetDescription>
            </SheetHeader>
            <div className="mt-6">
              <ControlPanel />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </MainLayout>
  )
}
