// Brand Colors
export const COLORS = {
  charcoal: '#111111',
  ivory: '#F8F8F8',
  crimson: '#D72638',
  blue: '#3A6FF7',
  gray: '#7A7A7A',
  beige: '#E8E2D3',
} as const

// Fashion Categories
export const CATEGORIES = {
  TOP: 'top',
  BOTTOM: 'bottom',
  SHOES: 'shoes',
  ACCESSORY: 'accessory',
  OUTERWEAR: 'outerwear',
  DRESS: 'dress',
  BAG: 'bag',
} as const

// Style Preferences
export const STYLES = [
  'casual',
  'formal',
  'street',
  'boho',
  'minimal',
  'vintage',
] as const

// Occasions
export const OCCASIONS = [
  'casual',
  'work',
  'party',
  'date',
  'sport',
  'travel',
  'formal',
] as const

// Seasons
export const SEASONS = ['spring', 'summer', 'fall', 'winter', 'all-season'] as const

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    VERIFY_EMAIL: '/auth/verify-email',
    PASSWORD_RESET: '/auth/password-reset',
  },
  USERS: '/users',
  OUTFITS: '/outfits',
  WARDROBE: '/wardrobe',
  SOCIAL: '/social',
  SEARCH: '/search',
  CART: '/cart',
  NOTIFICATIONS: '/notifications',
  ADMIN: '/admin',
} as const

// Pagination
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 12,
  MAX_PAGE_SIZE: 50,
} as const

// File Upload
export const FILE_UPLOAD = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  MAX_IMAGES_PER_POST: 10,
} as const
