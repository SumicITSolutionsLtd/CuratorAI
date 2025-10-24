import { useState } from 'react'
import { motion } from 'framer-motion'
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
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Badge } from '@/presentation/components/ui/badge'
import { Card } from '@/presentation/components/ui/card'
import { cn } from '@/shared/utils/cn'
import { Link } from 'react-router-dom'

const categories = [
  { id: 'all', name: 'All Items', icon: Grid3x3, count: 127, color: 'text-brand-crimson' },
  { id: 'tops', name: 'Tops', icon: Shirt, count: 45, color: 'text-brand-blue' },
  { id: 'bottoms', name: 'Bottoms', icon: ShoppingBag, count: 32, color: 'text-purple-500' },
  { id: 'accessories', name: 'Accessories', icon: Watch, count: 28, color: 'text-amber-500' },
  { id: 'shoes', name: 'Shoes', icon: Sparkles, count: 22, color: 'text-green-500' },
]

const wardrobeItems = [
  {
    id: 1,
    name: 'Silk Blouse',
    category: 'Tops',
    brand: 'Zara',
    color: 'Ivory',
    season: 'Summer',
    timesWorn: 12,
    image: 'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?w=400&h=500&fit=crop',
    lastWorn: '2 days ago',
  },
  {
    id: 2,
    name: 'High-Waisted Jeans',
    category: 'Bottoms',
    brand: "Levi's",
    color: 'Dark Blue',
    season: 'All Season',
    timesWorn: 28,
    image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400&h=500&fit=crop',
    lastWorn: '1 day ago',
  },
  {
    id: 3,
    name: 'Leather Jacket',
    category: 'Tops',
    brand: 'AllSaints',
    color: 'Black',
    season: 'Fall/Winter',
    timesWorn: 15,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=500&fit=crop',
    lastWorn: '5 days ago',
  },
  {
    id: 4,
    name: 'Floral Midi Dress',
    category: 'Dresses',
    brand: 'H&M',
    color: 'Multicolor',
    season: 'Spring/Summer',
    timesWorn: 8,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400&h=500&fit=crop',
    lastWorn: '1 week ago',
  },
  {
    id: 5,
    name: 'White Sneakers',
    category: 'Shoes',
    brand: 'Nike',
    color: 'White',
    season: 'All Season',
    timesWorn: 45,
    image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop',
    lastWorn: 'Today',
  },
  {
    id: 6,
    name: 'Cashmere Sweater',
    category: 'Tops',
    brand: 'Uniqlo',
    color: 'Beige',
    season: 'Fall/Winter',
    timesWorn: 18,
    image: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=400&h=500&fit=crop',
    lastWorn: '3 days ago',
  },
  {
    id: 7,
    name: 'Gold Hoop Earrings',
    category: 'Accessories',
    brand: 'Mejuri',
    color: 'Gold',
    season: 'All Season',
    timesWorn: 22,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400&h=500&fit=crop',
    lastWorn: '2 days ago',
  },
  {
    id: 8,
    name: 'Pleated Skirt',
    category: 'Bottoms',
    brand: 'COS',
    color: 'Navy',
    season: 'Spring/Fall',
    timesWorn: 10,
    image: 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=400&h=500&fit=crop',
    lastWorn: '4 days ago',
  },
]

export const WardrobePage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-brand-charcoal">My Wardrobe</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Organize, track, and style your fashion collection
            </p>
          </div>
          <div className="flex gap-2">
            <Link to="/wardrobe/create-outfit">
              <Button className="bg-brand-blue hover:bg-brand-blue/90">
                <Sparkles className="mr-2 h-4 w-4" />
                Create Outfit
              </Button>
            </Link>
            <Button className="bg-brand-crimson hover:bg-brand-crimson/90">
              <Plus className="mr-2 h-4 w-4" />
              Add Item
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <motion.div whileHover={{ y: -4, scale: 1.02 }} transition={{ duration: 0.2 }}>
            <Card className="border-brand-crimson/20 p-4 transition-all hover:shadow-lg hover:shadow-brand-crimson/10">
              <div className="flex items-center gap-3">
                <div className="rounded-full bg-brand-crimson/10 p-3">
                  <Shirt className="h-5 w-5 text-brand-crimson" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-brand-charcoal">127</p>
                  <p className="text-xs text-muted-foreground">Total Items</p>
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
                  <p className="text-2xl font-bold text-brand-charcoal">45</p>
                  <p className="text-xs text-muted-foreground">Outfits Created</p>
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
                  <p className="text-2xl font-bold text-brand-charcoal">$3,240</p>
                  <p className="text-xs text-muted-foreground">Total Value</p>
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
                  <p className="text-2xl font-bold text-brand-charcoal">23</p>
                  <p className="text-xs text-muted-foreground">Worn This Month</p>
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
                onClick={() => setSelectedCategory(category.id)}
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
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
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

        {/* Wardrobe Items Grid */}
        <div
          className={cn(
            'grid gap-4',
            viewMode === 'grid' ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'
          )}
        >
          {wardrobeItems.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link to={`/wardrobe/items/${item.id}`}>
                <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-brand-crimson/20">
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-brand-beige">
                    <motion.img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.3 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                    {/* Quick Stats Overlay */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileHover={{ opacity: 1, y: 0 }}
                      className="absolute bottom-2 left-2 right-2 flex gap-2"
                    >
                      <Badge className="bg-white/90 text-brand-charcoal hover:bg-white">
                        Worn {item.timesWorn}×
                      </Badge>
                      <Badge className="bg-white/90 text-brand-charcoal hover:bg-white">
                        {item.lastWorn}
                      </Badge>
                    </motion.div>
                  </div>

                  {/* Item Info */}
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1">
                        <h3 className="truncate font-semibold text-brand-charcoal">{item.name}</h3>
                        <p className="text-xs text-muted-foreground">{item.brand}</p>
                      </div>
                      <Badge variant="outline" className="shrink-0 text-xs">
                        {item.category}
                      </Badge>
                    </div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <div
                        className="h-3 w-3 rounded-full border"
                        style={{ backgroundColor: item.color.toLowerCase() }}
                      />
                      <span>{item.color}</span>
                      <span>•</span>
                      <span>{item.season}</span>
                    </div>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </MainLayout>
  )
}
