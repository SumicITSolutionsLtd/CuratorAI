import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Cart, CartItem, ShippingAddress, ShippingMethod } from '@domain/entities/Cart'
import { CartRepository } from '@infrastructure/repositories/CartRepository'

const cartRepository = new CartRepository()

interface CartState {
  cart: Cart | null
  items: CartItem[]
  itemCount: number
  subtotal: number
  shipping: number
  tax: number
  total: number
  promoCode: string | null
  discount: number
  shippingMethods: ShippingMethod[]
  isLoading: boolean
  error: string | null
}

const initialState: CartState = {
  cart: null,
  items: [],
  itemCount: 0,
  subtotal: 0,
  shipping: 0,
  tax: 0,
  total: 0,
  promoCode: null,
  discount: 0,
  shippingMethods: [],
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await cartRepository.getCart(userId)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch cart')
    }
  }
)

export const addToCart = createAsyncThunk(
  'cart/addItem',
  async ({ userId, item }: { userId: string; item: Omit<CartItem, 'id'> }, { rejectWithValue }) => {
    try {
      return await cartRepository.addItem(userId, item)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to add item')
    }
  }
)

export const updateQuantity = createAsyncThunk(
  'cart/updateQuantity',
  async (
    { userId, itemId, quantity }: { userId: string; itemId: string; quantity: number },
    { rejectWithValue }
  ) => {
    try {
      return await cartRepository.updateItemQuantity(userId, itemId, quantity)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update quantity')
    }
  }
)

export const removeFromCart = createAsyncThunk(
  'cart/removeItem',
  async ({ userId, itemId }: { userId: string; itemId: string }, { rejectWithValue }) => {
    try {
      return await cartRepository.removeItem(userId, itemId)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove item')
    }
  }
)

export const applyPromoCode = createAsyncThunk(
  'cart/applyPromoCode',
  async ({ userId, code }: { userId: string; code: string }, { rejectWithValue }) => {
    try {
      return await cartRepository.applyPromoCode(userId, code)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to apply promo code')
    }
  }
)

export const removePromoCode = createAsyncThunk(
  'cart/removePromoCode',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await cartRepository.removePromoCode(userId)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to remove promo code')
    }
  }
)

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (userId: string, { rejectWithValue }) => {
    try {
      await cartRepository.clearCart(userId)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to clear cart')
    }
  }
)

export const fetchShippingMethods = createAsyncThunk(
  'cart/fetchShippingMethods',
  async (_, { rejectWithValue }) => {
    try {
      return await cartRepository.getShippingMethods()
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch shipping methods')
    }
  }
)

export const calculateShipping = createAsyncThunk(
  'cart/calculateShipping',
  async ({ address, items }: { address: ShippingAddress; items: CartItem[] }, { rejectWithValue }) => {
    try {
      return await cartRepository.calculateShipping(address, items)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to calculate shipping')
    }
  }
)

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch cart
      .addCase(fetchCart.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.cart = action.payload
        state.items = action.payload.items
        state.itemCount = action.payload.itemCount
        state.subtotal = action.payload.subtotal
        state.shipping = action.payload.shipping
        state.tax = action.payload.tax
        state.total = action.payload.total
        state.promoCode = action.payload.promoCode || null
        state.discount = action.payload.discount || 0
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Add to cart
      .addCase(addToCart.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.isLoading = false
        state.cart = action.payload
        state.items = action.payload.items
        state.itemCount = action.payload.itemCount
        state.subtotal = action.payload.subtotal
        state.total = action.payload.total
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update quantity
      .addCase(updateQuantity.fulfilled, (state, action) => {
        state.cart = action.payload
        state.items = action.payload.items
        state.itemCount = action.payload.itemCount
        state.subtotal = action.payload.subtotal
        state.total = action.payload.total
      })
      // Remove from cart
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.cart = action.payload
        state.items = action.payload.items
        state.itemCount = action.payload.itemCount
        state.subtotal = action.payload.subtotal
        state.total = action.payload.total
      })
      // Apply promo code
      .addCase(applyPromoCode.fulfilled, (state, action) => {
        state.cart = action.payload
        state.promoCode = action.payload.promoCode || null
        state.discount = action.payload.discount || 0
        state.total = action.payload.total
      })
      // Remove promo code
      .addCase(removePromoCode.fulfilled, (state, action) => {
        state.cart = action.payload
        state.promoCode = null
        state.discount = 0
        state.total = action.payload.total
      })
      // Clear cart
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = null
        state.items = []
        state.itemCount = 0
        state.subtotal = 0
        state.shipping = 0
        state.tax = 0
        state.total = 0
        state.promoCode = null
        state.discount = 0
      })
      // Fetch shipping methods
      .addCase(fetchShippingMethods.fulfilled, (state, action) => {
        state.shippingMethods = action.payload
      })
      // Calculate shipping
      .addCase(calculateShipping.fulfilled, (state, action) => {
        state.shipping = action.payload
        if (state.cart) {
          state.cart.shipping = action.payload
          state.total = state.subtotal + action.payload + state.tax - state.discount
        }
      })
  },
})

export const { clearError } = cartSlice.actions
export default cartSlice.reducer
