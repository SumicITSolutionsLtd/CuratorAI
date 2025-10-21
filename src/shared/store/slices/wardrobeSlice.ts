import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { WardrobeItem } from '@domain/entities/Wardrobe'

interface WardrobeState {
  items: WardrobeItem[]
  selectedCategory: string | null
}

const initialState: WardrobeState = {
  items: [],
  selectedCategory: null,
}

const wardrobeSlice = createSlice({
  name: 'wardrobe',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<WardrobeItem[]>) => {
      state.items = action.payload
    },
    addItem: (state, action: PayloadAction<WardrobeItem>) => {
      state.items.push(action.payload)
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)
    },
    setSelectedCategory: (state, action: PayloadAction<string | null>) => {
      state.selectedCategory = action.payload
    },
  },
})

export const { setItems, addItem, removeItem, setSelectedCategory } = wardrobeSlice.actions
export default wardrobeSlice.reducer
