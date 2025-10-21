export interface CartItem {
  id: string
  outfitItemId: string
  name: string
  brand: string
  price: number
  currency: string
  size?: string
  color: string
  quantity: number
  imageUrl: string
  productUrl?: string
  inStock: boolean
}

export interface Cart {
  id: string
  userId: string
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  total: number
  currency: string
  promoCode?: string
  discount?: number
  itemCount: number
  updatedAt: Date
}

export interface ShippingAddress {
  fullName: string
  email: string
  phone: string
  streetAddress: string
  city: string
  state: string
  zipCode: string
  country: string
}

export interface ShippingMethod {
  id: string
  name: string
  description: string
  price: number
  estimatedDays: string
  selected: boolean
}

export interface OrderSummary {
  items: CartItem[]
  subtotal: number
  shipping: number
  tax: number
  discount: number
  total: number
  currency: string
}
