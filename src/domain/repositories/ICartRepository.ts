import { Cart, CartItem, ShippingAddress, ShippingMethod } from '../entities/Cart'

export interface ICartRepository {
  getCart(userId: string): Promise<Cart>
  addItem(userId: string, item: Omit<CartItem, 'id'>): Promise<Cart>
  updateItemQuantity(userId: string, itemId: string, quantity: number): Promise<Cart>
  removeItem(userId: string, itemId: string): Promise<Cart>
  applyPromoCode(userId: string, code: string): Promise<Cart>
  removePromoCode(userId: string): Promise<Cart>
  clearCart(userId: string): Promise<void>
  getShippingMethods(): Promise<ShippingMethod[]>
  calculateShipping(address: ShippingAddress, items: CartItem[]): Promise<number>
}
