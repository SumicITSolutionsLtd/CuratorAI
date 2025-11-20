import { ICartRepository } from '@domain/repositories/ICartRepository'
import { Cart, CartItem, ShippingAddress, ShippingMethod } from '@domain/entities/Cart'
import { apiClient } from '../api/ApiClient'

export class CartRepository implements ICartRepository {
  async getCart(userId: string): Promise<Cart> {
    return apiClient.get<Cart>(`/cart/${userId}`)
  }

  async addItem(userId: string, item: Omit<CartItem, 'id'>): Promise<Cart> {
    return apiClient.post<Cart>(`/cart/${userId}/items`, item)
  }

  async updateItemQuantity(userId: string, itemId: string, quantity: number): Promise<Cart> {
    return apiClient.patch<Cart>(`/cart/${userId}/items/${itemId}`, { quantity })
  }

  async removeItem(userId: string, itemId: string): Promise<Cart> {
    return apiClient.delete<Cart>(`/cart/${userId}/items/${itemId}/remove`)
  }

  async applyPromoCode(userId: string, code: string): Promise<Cart> {
    return apiClient.post<Cart>(`/cart/${userId}/promo`, { code })
  }

  async removePromoCode(userId: string): Promise<Cart> {
    return apiClient.delete<Cart>(`/cart/${userId}/promo/remove`)
  }

  async clearCart(userId: string): Promise<void> {
    await apiClient.delete<void>(`/cart/${userId}/clear`)
  }

  async getShippingMethods(): Promise<ShippingMethod[]> {
    const response = await apiClient.get<{ methods: ShippingMethod[] }>('/cart/shipping/methods')
    return response.methods
  }

  async calculateShipping(address: ShippingAddress, items: CartItem[]): Promise<number> {
    const response = await apiClient.post<{ shippingCost: number }>('/cart/shipping/calculate', {
      address,
      items,
    })
    return response.shippingCost
  }
}
