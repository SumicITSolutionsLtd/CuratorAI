import { WardrobeItem } from '@/domain/entities/Wardrobe'

export type SortOption = 'date' | 'timesWorn' | 'price' | 'brand' | 'name'

/**
 * Safely get timestamp from a date value that might be a Date object or ISO string
 */
const getTimestamp = (date: Date | string | undefined | null): number => {
  if (!date) return 0
  if (date instanceof Date) return date.getTime()
  const parsed = new Date(date)
  return isNaN(parsed.getTime()) ? 0 : parsed.getTime()
}

/**
 * Sort wardrobe items by various criteria
 * Handles both Date objects and ISO string dates safely
 */
export const sortItems = (items: WardrobeItem[], sortBy: SortOption): WardrobeItem[] => {
  const sorted = [...items]

  switch (sortBy) {
    case 'date':
      return sorted.sort((a, b) => getTimestamp(b.createdAt) - getTimestamp(a.createdAt))
    case 'timesWorn':
      return sorted.sort((a, b) => (b.timesWorn || 0) - (a.timesWorn || 0))
    case 'price':
      return sorted.sort((a, b) => (b.price || 0) - (a.price || 0))
    case 'brand':
      return sorted.sort((a, b) => (a.brand || '').localeCompare(b.brand || ''))
    case 'name':
      return sorted.sort((a, b) => a.name.localeCompare(b.name))
    default:
      return sorted
  }
}

/**
 * Get unique brands from wardrobe items
 */
export const getBrandsFromItems = (items: WardrobeItem[]): string[] => {
  const brands = new Set(items.map((item) => item.brand).filter(Boolean))
  return Array.from(brands).sort() as string[]
}

/**
 * Get unique colors from wardrobe items
 */
export const getColorsFromItems = (items: WardrobeItem[]): string[] => {
  const colors = new Set(items.map((item) => item.color).filter(Boolean))
  return Array.from(colors).sort()
}

/**
 * Get unique seasons from wardrobe items
 */
export const getSeasonsFromItems = (items: WardrobeItem[]): string[] => {
  const seasons = new Set<string>()
  items.forEach((item) => {
    const seasonAttr = item.attributes.find((attr) => attr.key === 'season')
    if (seasonAttr?.value) {
      seasons.add(seasonAttr.value)
    }
  })
  return Array.from(seasons).sort()
}

/**
 * Filter wardrobe items based on various criteria
 */
export const filterItems = (
  items: WardrobeItem[],
  filters: {
    category?: WardrobeItem['category']
    brand?: string
    color?: string
    season?: string
    minPrice?: number
    maxPrice?: number
  }
): WardrobeItem[] => {
  return items.filter((item) => {
    if (filters.category && item.category !== filters.category) return false
    if (filters.brand && item.brand !== filters.brand) return false
    if (filters.color && !item.color.toLowerCase().includes(filters.color.toLowerCase()))
      return false
    if (
      filters.season &&
      !item.attributes.some(
        (attr) =>
          attr.key === 'season' && attr.value.toLowerCase().includes(filters.season!.toLowerCase())
      )
    )
      return false
    if (filters.minPrice && item.price && item.price < filters.minPrice) return false
    if (filters.maxPrice && item.price && item.price > filters.maxPrice) return false
    return true
  })
}

/**
 * Search wardrobe items by query
 */
export const searchItems = (items: WardrobeItem[], query: string): WardrobeItem[] => {
  if (!query.trim()) return items

  const lowerQuery = query.toLowerCase()
  return items.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.brand?.toLowerCase().includes(lowerQuery) ||
      item.color.toLowerCase().includes(lowerQuery) ||
      item.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
  )
}

/**
 * Get recently added items
 */
export const getRecentlyAddedItems = (items: WardrobeItem[], limit: number = 6): WardrobeItem[] => {
  return sortItems(items, 'date').slice(0, limit)
}

/**
 * Get most worn items
 */
export const getMostWornItems = (items: WardrobeItem[], limit: number = 6): WardrobeItem[] => {
  return sortItems(items, 'timesWorn').slice(0, limit)
}

/**
 * Get paginated items
 */
export const getPaginatedItems = (
  items: WardrobeItem[],
  page: number,
  pageSize: number
): { items: WardrobeItem[]; hasMore: boolean } => {
  const start = (page - 1) * pageSize
  const end = start + pageSize
  return {
    items: items.slice(start, end),
    hasMore: end < items.length,
  }
}
