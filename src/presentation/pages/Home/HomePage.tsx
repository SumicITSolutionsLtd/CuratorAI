import { useState } from 'react'
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
} from 'lucide-react'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import { OutfitGrid } from '@/presentation/components/outfit/OutfitGrid'
import { FilterPanel } from '@/presentation/components/outfit/FilterPanel'
import { ControlPanel } from '@/presentation/components/outfit/ControlPanel'
import { Card } from '@/presentation/components/ui/card'
import { Button } from '@/presentation/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/presentation/components/ui/sheet'

const mockOutfits = [
  {
    id: '1',
    name: 'Summer Vibes Ensemble',
    imageUrl: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400',
    items: [
      { name: 'Floral Midi Dress', price: 89 },
      { name: 'Strappy Sandals', price: 45 },
      { name: 'Straw Tote Bag', price: 32 },
    ],
    totalPrice: 166,
    matchScore: 95,
    tags: ['Summer', 'Casual', 'Floral'],
    likes: 234,
  },
  {
    id: '2',
    name: 'Urban Street Style',
    imageUrl: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400',
    items: [
      { name: 'Graphic Hoodie', price: 65 },
      { name: 'Denim Jacket', price: 98 },
      { name: 'White Sneakers', price: 85 },
    ],
    totalPrice: 248,
    matchScore: 92,
    tags: ['Street', 'Urban', 'Casual'],
    likes: 189,
  },
  {
    id: '3',
    name: 'Elegant Office Look',
    imageUrl: 'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=400',
    items: [
      { name: 'Tailored Blazer', price: 145 },
      { name: 'Silk Blouse', price: 78 },
      { name: 'Ankle Boots', price: 120 },
    ],
    totalPrice: 343,
    matchScore: 88,
    tags: ['Work', 'Formal', 'Elegant'],
    likes: 156,
  },
  {
    id: '4',
    name: 'Boho Chic Outfit',
    imageUrl: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400',
    items: [
      { name: 'Flowing Maxi Skirt', price: 68 },
      { name: 'Crochet Top', price: 45 },
      { name: 'Leather Sandals', price: 55 },
    ],
    totalPrice: 168,
    matchScore: 90,
    tags: ['Boho', 'Casual', 'Festival'],
    likes: 201,
  },
  {
    id: '5',
    name: 'Minimal Monochrome',
    imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
    items: [
      { name: 'Black Turtleneck', price: 42 },
      { name: 'Wide-leg Trousers', price: 89 },
      { name: 'Minimalist Bag', price: 110 },
    ],
    totalPrice: 241,
    matchScore: 94,
    tags: ['Minimal', 'Monochrome', 'Chic'],
    likes: 278,
  },
  {
    id: '6',
    name: 'Date Night Glam',
    imageUrl: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400',
    items: [
      { name: 'Satin Slip Dress', price: 125 },
      { name: 'Heeled Mules', price: 95 },
      { name: 'Statement Earrings', price: 38 },
    ],
    totalPrice: 258,
    matchScore: 93,
    tags: ['Date', 'Evening', 'Romantic'],
    likes: 312,
  },
]

export const HomePage = () => {
  const [filterOpen, setFilterOpen] = useState(false)
  const [controlOpen, setControlOpen] = useState(false)

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
            <h1 className="text-3xl font-bold">Good morning, Sarah!</h1>
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              ☀️
            </motion.div>
          </div>
          <p className="text-muted-foreground">
            We've found{' '}
            <span className="font-semibold text-brand-crimson">
              {mockOutfits.length} perfect matches
            </span>{' '}
            for you today
          </p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="rounded-lg border bg-gradient-to-br from-brand-crimson/10 to-brand-crimson/5 p-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">New Recommendations</p>
                <p className="text-2xl font-bold">12</p>
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
                <p className="text-2xl font-bold">8</p>
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
                <p className="text-2xl font-bold">95%</p>
              </div>
              <div className="text-3xl">✨</div>
            </div>
          </motion.div>
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
                className="group rounded-lg border bg-gradient-to-br from-brand-ivory to-white p-4 text-left transition-all hover:border-brand-crimson hover:shadow-md"
              >
                <Zap className="mb-2 h-6 w-6 text-brand-crimson" />
                <h3 className="mb-1 font-semibold text-brand-charcoal">Quick Style</h3>
                <p className="text-xs text-muted-foreground">1-tap outfits for today</p>
              </motion.button>

              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group rounded-lg border bg-gradient-to-br from-brand-ivory to-white p-4 text-left transition-all hover:border-brand-blue hover:shadow-md"
              >
                <Palette className="mb-2 h-6 w-6 text-brand-blue" />
                <h3 className="mb-1 font-semibold text-brand-charcoal">Color Mood</h3>
                <p className="text-xs text-muted-foreground">Pick a palette & vibe</p>
              </motion.button>

              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group rounded-lg border bg-gradient-to-br from-brand-ivory to-white p-4 text-left transition-all hover:border-brand-crimson hover:shadow-md"
              >
                <Calendar className="mb-2 h-6 w-6 text-brand-crimson" />
                <h3 className="mb-1 font-semibold text-brand-charcoal">Event Ready</h3>
                <p className="text-xs text-muted-foreground">AI looks by occasion</p>
              </motion.button>

              <motion.button
                whileHover={{ y: -4 }}
                whileTap={{ scale: 0.98 }}
                className="group rounded-lg border bg-gradient-to-br from-brand-ivory to-white p-4 text-left transition-all hover:border-brand-blue hover:shadow-md"
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
            <OutfitGrid outfits={mockOutfits} />
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
