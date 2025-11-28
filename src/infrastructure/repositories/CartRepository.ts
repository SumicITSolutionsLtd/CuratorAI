import { ICartRepository } from '@domain/repositories/ICartRepository'
import { Cart, CartItem, ShippingAddress, ShippingMethod } from '@domain/entities/Cart'
import { apiClient } from '../api/ApiClient'

export class CartRepository implements ICartRepository {
  // Transform backend cart response to frontend format
  // Note: API returns subtotal, shipping, tax, discount, total as decimal strings
  private transformCart(backendCart: any): Cart {
    const items = this.transformCartItems(backendCart.items || [])
    const calculatedSubtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    return {
      id: backendCart.id?.toString() || '',
      userId: backendCart.user_id?.toString() || backendCart.user?.toString() || '',
      items,
      subtotal: parseFloat(backendCart.subtotal) || calculatedSubtotal,
      shipping: parseFloat(backendCart.shipping_cost || backendCart.shipping) || 0,
      tax: parseFloat(backendCart.tax) || 0,
      total: parseFloat(backendCart.total || backendCart.grand_total) || calculatedSubtotal,
      currency: backendCart.currency || 'USD',
      promoCode: backendCart.promo_code || backendCart.promoCode || undefined,
      discount: parseFloat(backendCart.discount) || 0,
      itemCount: backendCart.item_count || items.reduce((sum, item) => sum + item.quantity, 0),
      updatedAt: new Date(backendCart.updated_at || backendCart.updatedAt || new Date()),
    }
  }

  // Transform backend cart items to frontend format
  private transformCartItems(backendItems: any[]): CartItem[] {
    return backendItems.map((item) => ({
      id: item.id?.toString() || '',
      outfitItemId: item.outfit_item_id?.toString() || item.outfitItemId?.toString() || '',
      name: item.name || '',
      brand: item.brand || '',
      price: parseFloat(item.price) || 0,
      currency: item.currency || 'USD',
      size: item.size,
      color: item.color || '',
      quantity: item.quantity || 1,
      imageUrl: item.image_url || item.imageUrl || item.image || '',
      productUrl: item.product_url || item.productUrl,
      inStock: item.in_stock ?? item.inStock ?? true,
    }))
  }

  async getCart(userId: string): Promise<Cart> {
    const response = await apiClient.get<any>(`/cart/${userId}/`)
    return this.transformCart(response.data || response)
  }

  async addItem(userId: string, item: Omit<CartItem, 'id'>): Promise<Cart> {
    // Transform camelCase to snake_case for API
    const payload = {
      outfit_item_id: parseInt(item.outfitItemId) || 0,
      name: item.name,
      brand: item.brand,
      price: item.price.toString(),
      size: item.size,
      color: item.color,
      quantity: item.quantity,
      image_url: item.imageUrl,
    }
    const response = await apiClient.post<any>(`/cart/${userId}/items/`, payload)
    return this.transformCart(response.data || response)
  }

  async updateItemQuantity(userId: string, itemId: string, quantity: number): Promise<Cart> {
    const response = await apiClient.patch<any>(`/cart/${userId}/items/${itemId}/`, { quantity })
    return this.transformCart(response.data || response)
  }

  async removeItem(userId: string, itemId: string): Promise<Cart> {
    const response = await apiClient.delete<any>(`/cart/${userId}/items/${itemId}/remove/`)
    return this.transformCart(response.data || response)
  }

  async applyPromoCode(userId: string, code: string): Promise<Cart> {
    const response = await apiClient.post<any>(`/cart/${userId}/promo/`, { code })
    return this.transformCart(response.data || response)
  }

  async removePromoCode(userId: string): Promise<Cart> {
    const response = await apiClient.delete<any>(`/cart/${userId}/promo/remove/`)
    return this.transformCart(response.data || response)
  }

  async clearCart(userId: string): Promise<void> {
    await apiClient.delete<void>(`/cart/${userId}/clear/`)
  }

  async getShippingMethods(): Promise<ShippingMethod[]> {
    const response = await apiClient.get<any>('/cart/shipping/methods/')
    const methods =
      response.data?.shipping_methods || response.shipping_methods || response.methods || []
    return methods.map((method: any) => ({
      id: method.id?.toString() || '',
      name: method.name || '',
      description: method.description || '',
      price: parseFloat(method.price) || 0,
      estimatedDays: method.estimated_days || method.estimatedDays || '',
      selected: method.selected || false,
    }))
  }

  async calculateShipping(address: ShippingAddress, items: CartItem[]): Promise<number> {
    const payload = {
      address: {
        full_name: address.fullName,
        email: address.email,
        phone: address.phone,
        street_address: address.streetAddress,
        city: address.city,
        state: address.state,
        zip_code: address.zipCode,
        country: address.country,
      },
      items: items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    }
    const response = await apiClient.post<any>('/cart/shipping/calculate/', payload)
    return response.data?.shipping_cost || response.shipping_cost || response.shippingCost || 0
  }
}
