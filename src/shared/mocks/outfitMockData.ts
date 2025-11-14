import { SwapAlternative } from '@/presentation/components/outfit/StyleSwapDrawer'

export type SellerType = 'curator' | 'partner' | 'external'

export interface OutfitItem {
  id: string
  name: string
  brand: string
  price: number
  size: string
  image: string
  seller: SellerType
  sellerName?: string
  sellerDomain?: string
  stylistNote: string
  category: 'top' | 'bottom' | 'shoes' | 'accessory' | 'outerwear' | 'dress'
  available: boolean
}

export interface OutfitDetail {
  id: string
  name: string
  description: string
  heroImage: string
  images: string[]
  matchScore: number
  totalPrice: number
  items: OutfitItem[]
  aiInsights: string[]
  styleTags: string[]
  occasion: string[]
  season: string
  vibe: string
}

// Swap alternatives for each item
export const swapAlternatives: Record<string, SwapAlternative[]> = {
  'item-1': [
    {
      id: 'swap-1-1',
      name: 'Premium Linen Tee',
      brand: 'Everlane',
      price: 35.0,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200',
      size: 'M',
      seller: 'curator',
      matchScore: 96,
      reason: 'Higher quality fabric, better fit for your body type',
      category: ['higher-quality', 'available-size', 'similar-vibe'],
    },
    {
      id: 'swap-1-2',
      name: 'Basic White Tee',
      brand: 'Uniqlo',
      price: 14.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200',
      size: 'M',
      seller: 'partner',
      sellerName: 'Uniqlo',
      matchScore: 92,
      reason: 'Budget-friendly alternative, same clean aesthetic',
      category: ['cheaper', 'available-size'],
    },
    {
      id: 'swap-1-3',
      name: 'Organic Cotton Tee',
      brand: 'Zara',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200',
      size: 'M',
      seller: 'curator',
      matchScore: 94,
      reason: 'Sustainable option, trending in your region',
      category: ['same-brand', 'trending', 'available-size'],
    },
    {
      id: 'swap-1-4',
      name: 'Relaxed Fit Tee',
      brand: 'COS',
      price: 45.0,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200',
      size: 'M',
      seller: 'external',
      sellerName: 'COS',
      matchScore: 93,
      reason: 'Better color harmony with jeans, premium cotton',
      category: ['better-color', 'higher-quality'],
    },
  ],
  'item-2': [
    {
      id: 'swap-2-1',
      name: 'High-Waisted Mom Jeans',
      brand: "Levi's",
      price: 68.0,
      image: 'https://images.unsplash.com/photo-1542272454315-7f6b8c2f0e3b?w=200',
      size: '30',
      seller: 'curator',
      matchScore: 97,
      reason: 'Trending style, better fit for your body shape',
      category: ['trending', 'available-size', 'similar-vibe'],
    },
    {
      id: 'swap-2-2',
      name: 'Slim Fit Jeans',
      brand: 'H&M',
      price: 39.99,
      image: 'https://images.unsplash.com/photo-1542272454315-7f6b8c2f0e3b?w=200',
      size: '30',
      seller: 'partner',
      sellerName: 'H&M',
      matchScore: 91,
      reason: 'Budget option, same brand quality',
      category: ['cheaper', 'same-brand'],
    },
    {
      id: 'swap-2-3',
      name: 'Vintage Straight Leg',
      brand: 'Madewell',
      price: 98.0,
      image: 'https://images.unsplash.com/photo-1542272454315-7f6b8c2f0e3b?w=200',
      size: '30',
      seller: 'external',
      sellerName: 'Madewell',
      matchScore: 95,
      reason: 'Premium denim, perfect wash for summer',
      category: ['higher-quality', 'better-color'],
    },
  ],
  'item-3': [
    {
      id: 'swap-3-1',
      name: 'Air Force 1',
      brand: 'Nike',
      price: 90.0,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200',
      size: '9',
      seller: 'curator',
      matchScore: 98,
      reason: 'Iconic style, same brand, slightly better price',
      category: ['same-brand', 'trending', 'available-size'],
    },
    {
      id: 'swap-3-2',
      name: 'Stan Smith Sneakers',
      brand: 'Adidas',
      price: 85.0,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200',
      size: '9',
      seller: 'curator',
      matchScore: 96,
      reason: 'Classic alternative, great with jeans',
      category: ['cheaper', 'similar-vibe', 'better-color'],
    },
    {
      id: 'swap-3-3',
      name: 'Court Vision Low',
      brand: 'Nike',
      price: 65.0,
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200',
      size: '9',
      seller: 'partner',
      sellerName: 'Nike',
      matchScore: 94,
      reason: 'Budget-friendly Nike option, similar silhouette',
      category: ['cheaper', 'same-brand', 'available-size'],
    },
  ],
  'item-4': [
    {
      id: 'swap-4-1',
      name: 'Leather Mini Bag',
      brand: 'Mango',
      price: 79.99,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200',
      seller: 'curator',
      matchScore: 95,
      reason: 'Better price, trending style, genuine leather',
      category: ['cheaper', 'trending', 'higher-quality'],
    },
    {
      id: 'swap-4-2',
      name: 'Classic Crossbody',
      brand: 'Coach',
      price: 120.0,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200',
      seller: 'external',
      sellerName: 'Coach',
      matchScore: 92,
      reason: 'Same brand, different style, premium leather',
      category: ['same-brand', 'higher-quality'],
    },
    {
      id: 'swap-4-3',
      name: 'Vegan Leather Bag',
      brand: 'Matt & Nat',
      price: 95.0,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200',
      seller: 'curator',
      matchScore: 93,
      reason: 'Sustainable choice, trending in your area',
      category: ['cheaper', 'trending', 'similar-vibe'],
    },
  ],
}

export const mockOutfitDetail: OutfitDetail = {
  id: '1',
  name: 'Effortless Weekend Edit',
  description:
    'A minimalist take on casual cool—crisp, clean, and curated for those who appreciate understated style.',
  heroImage: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
  images: [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
    'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=800',
    'https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?w=800',
  ],
  matchScore: 95,
  totalPrice: 284.98,
  items: [
    {
      id: 'item-1',
      name: 'White Cotton T-Shirt',
      brand: 'Zara',
      price: 29.99,
      size: 'M',
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=200',
      seller: 'curator',
      stylistNote: 'The foundation of any capsule wardrobe—elevated by perfect drape and weight.',
      category: 'top',
      available: true,
    },
    {
      id: 'item-2',
      name: 'Blue Denim Jeans',
      brand: 'H&M',
      price: 49.99,
      size: '30',
      image: 'https://images.unsplash.com/photo-1542272454315-7f6b8c2f0e3b?w=200',
      seller: 'partner',
      sellerName: 'H&M',
      stylistNote: 'Timeless mid-wash denim that works from brunch to happy hour.',
      category: 'bottom',
      available: true,
    },
    {
      id: 'item-3',
      name: 'White Sneakers',
      brand: 'Nike',
      price: 85.0,
      size: '9',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=200',
      seller: 'curator',
      stylistNote: 'Clean lines meet comfort—the sneaker that goes everywhere.',
      category: 'shoes',
      available: true,
    },
    {
      id: 'item-4',
      name: 'Black Crossbody Bag',
      brand: 'Coach',
      price: 120.0,
      size: 'One Size',
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=200',
      seller: 'external',
      sellerName: 'Coach',
      sellerDomain: 'coach.com',
      stylistNote: 'Hands-free elegance with just enough structure to elevate the look.',
      category: 'accessory',
      available: true,
    },
  ],
  aiInsights: [
    'Matches your minimalist style preference and neutral color palette',
    'All items available in your confirmed size (M, 30, 9)',
    'Within your preferred budget range ($200-$350)',
    'Perfect for the casual weekend vibe you have been exploring',
    'Trending in your location (San Francisco) this season',
  ],
  styleTags: ['Minimalist', 'Weekend', 'Casual', 'Timeless'],
  occasion: ['Weekend Brunch', 'Shopping', 'Coffee Date', 'Casual Hangout'],
  season: 'Spring/Summer',
  vibe: 'Effortlessly chic, relaxed confidence',
}

// Analytics event tracking
export const trackSwapEvent = (
  eventType:
    | 'open_swap_drawer'
    | 'swap_suggested'
    | 'swap_applied'
    | 'try_similar_clicked'
    | 'variant_created',
  data: {
    outfitId: string
    itemId?: string
    swapId?: string
    variantId?: string
  }
) => {
  // In production, this would send to analytics service
  console.log('[Analytics]', eventType, data)

  // Example analytics payload
  const payload = {
    event: eventType,
    timestamp: new Date().toISOString(),
    ...data,
  }

  // Would integrate with analytics service (e.g., Mixpanel, Segment, GA4)
  return payload
}
