import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { CartItem } from '@domain/entities/Cart'

interface CartState {
  items: CartItem[]
  itemCount: number
  subtotal: number
  total: number
}

const initialState: CartState = {
  items: [],
  itemCount: 0,
  subtotal: 0,
  total: 0,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload)
      state.itemCount += 1
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
      state.itemCount = state.items.length
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ itemId: string; quantity: number }>
    ) => {
      const item = state.items.find((i) => i.id === action.payload.itemId)
      if (item) {
        item.quantity = action.payload.quantity
      }
    },
    clearCart: (state) => {
      state.items = []
      state.itemCount = 0
      state.subtotal = 0
      state.total = 0
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
