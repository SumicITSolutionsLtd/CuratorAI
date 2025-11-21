import { describe, it, expect, beforeEach, vi } from 'vitest'
import { CartRepository } from './CartRepository'
import { apiClient } from '../api/ApiClient'
import type { Cart, CartItem } from '@domain/entities/Cart'

vi.mock('../api/ApiClient', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('CartRepository', () => {
  let cartRepository: CartRepository

  beforeEach(() => {
    cartRepository = new CartRepository()
    vi.clearAllMocks()
  })

  describe('getCart', () => {
    it('should get user shopping cart', async () => {
      const userId = 'user123'
      const mockCart = {
        id: 'cart123',
        userId,
        items: [],
        total: 0,
        subtotal: 0,
      } as unknown as Cart

      vi.mocked(apiClient.get).mockResolvedValue(mockCart)

      const result = await cartRepository.getCart(userId)

      expect(apiClient.get).toHaveBeenCalledWith(`/cart/${userId}`)
      expect(result).toEqual(mockCart)
    })

    it('should throw error when cart is not found', async () => {
      const userId = 'user123'
      vi.mocked(apiClient.get).mockRejectedValue(new Error('Not found'))

      await expect(cartRepository.getCart(userId)).rejects.toThrow('Not found')
    })
  })

  describe('addItem', () => {
    it('should add item to cart', async () => {
      const userId = 'user123'
      const item = {
        id: 'item123',
        productId: 'product123',
        quantity: 1,
        price: 99.99,
      } as unknown as CartItem

      const mockUpdatedCart = {
        id: 'cart123',
        userId,
        items: [item],
        total: 99.99,
        subtotal: 99.99,
      } as unknown as Cart

      vi.mocked(apiClient.post).mockResolvedValue(mockUpdatedCart)

      const result = await cartRepository.addItem(userId, item)

      expect(apiClient.post).toHaveBeenCalledWith(`/cart/${userId}/items`, item)
      expect(result).toEqual(mockUpdatedCart)
    })
  })

  describe('updateItemQuantity', () => {
    it('should update item quantity in cart', async () => {
      const userId = 'user123'
      const itemId = 'item123'
      const quantity = 3

      const mockUpdatedCart = {
        id: 'cart123',
        userId,
        items: [
          {
            id: itemId,
            quantity,
            price: 99.99,
          } as CartItem,
        ],
        total: 299.97,
        subtotal: 299.97,
      } as unknown as Cart

      vi.mocked(apiClient.patch).mockResolvedValue(mockUpdatedCart)

      const result = await cartRepository.updateItemQuantity(userId, itemId, quantity)

      expect(apiClient.patch).toHaveBeenCalledWith(`/cart/${userId}/items/${itemId}`, { quantity })
      expect(result).toEqual(mockUpdatedCart)
    })
  })

  describe('removeItem', () => {
    it('should remove item from cart', async () => {
      const userId = 'user123'
      const itemId = 'item123'

      const mockUpdatedCart = {
        id: 'cart123',
        userId,
        items: [],
        total: 0,
        subtotal: 0,
      } as unknown as Cart

      vi.mocked(apiClient.delete).mockResolvedValue(mockUpdatedCart)

      const result = await cartRepository.removeItem(userId, itemId)

      expect(apiClient.delete).toHaveBeenCalledWith(`/cart/${userId}/items/${itemId}/remove`)
      expect(result).toEqual(mockUpdatedCart)
    })
  })

  describe('applyPromoCode', () => {
    it('should apply promo code to cart', async () => {
      const userId = 'user123'
      const promoCode = 'SUMMER20'

      const mockUpdatedCart = {
        id: 'cart123',
        userId,
        items: [],
        total: 80,
        subtotal: 100,
        discount: 20,
        promoCode,
      } as unknown as Cart

      vi.mocked(apiClient.post).mockResolvedValue(mockUpdatedCart)

      const result = await cartRepository.applyPromoCode(userId, promoCode)

      expect(apiClient.post).toHaveBeenCalledWith(`/cart/${userId}/promo`, { code: promoCode })
      expect(result).toEqual(mockUpdatedCart)
    })

    it('should throw error for invalid promo code', async () => {
      const userId = 'user123'
      const promoCode = 'INVALID'

      vi.mocked(apiClient.post).mockRejectedValue(new Error('Invalid promo code'))

      await expect(cartRepository.applyPromoCode(userId, promoCode)).rejects.toThrow(
        'Invalid promo code'
      )
    })
  })

  describe('removePromoCode', () => {
    it('should remove promo code from cart', async () => {
      const userId = 'user123'

      const mockUpdatedCart = {
        id: 'cart123',
        userId,
        items: [],
        total: 100,
        subtotal: 100,
        discount: 0,
        promoCode: null,
      } as unknown as Cart

      vi.mocked(apiClient.delete).mockResolvedValue(mockUpdatedCart)

      const result = await cartRepository.removePromoCode(userId)

      expect(apiClient.delete).toHaveBeenCalledWith(`/cart/${userId}/promo/remove`)
      expect(result).toEqual(mockUpdatedCart)
    })
  })

  describe('clearCart', () => {
    it('should clear all items from cart', async () => {
      const userId = 'user123'
      vi.mocked(apiClient.delete).mockResolvedValue(undefined)

      await cartRepository.clearCart(userId)

      expect(apiClient.delete).toHaveBeenCalledWith(`/cart/${userId}/clear`)
    })
  })
})
