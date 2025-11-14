import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { WardrobeItem, Wardrobe, WardrobeStats } from '@domain/entities/Wardrobe'
import { mockWardrobe, mockWardrobeStats, getItemById } from '@/shared/mocks/wardrobeMockData'

interface WardrobeState {
  wardrobe: Wardrobe | null
  items: WardrobeItem[]
  stats: WardrobeStats | null
  selectedCategory: WardrobeItem['category'] | 'all'
  searchQuery: string
  sortBy: 'date' | 'timesWorn' | 'price' | 'brand' | 'name'
  filters: {
    brand?: string
    color?: string
    season?: string
    minPrice?: number
    maxPrice?: number
  }
  isLoading: boolean
  isLoadingStats: boolean
  error: string | null
}

const initialState: WardrobeState = {
  wardrobe: null,
  items: [],
  stats: null,
  selectedCategory: 'all',
  searchQuery: '',
  sortBy: 'date',
  filters: {},
  isLoading: false,
  isLoadingStats: false,
  error: null,
}

// Async Thunks

export const fetchWardrobe = createAsyncThunk('wardrobe/fetchWardrobe', async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))
  return mockWardrobe
})

export const fetchWardrobeStats = createAsyncThunk('wardrobe/fetchWardrobeStats', async () => {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 300))
  return mockWardrobeStats
})

export const addWardrobeItem = createAsyncThunk(
  'wardrobe/addItem',
  async (item: Omit<WardrobeItem, 'id' | 'createdAt' | 'updatedAt'>) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    const newItem: WardrobeItem = {
      ...item,
      id: `item-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    return newItem
  }
)

export const updateWardrobeItem = createAsyncThunk(
  'wardrobe/updateItem',
  async ({ id, updates }: { id: string; updates: Partial<WardrobeItem> }) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    const existingItem = getItemById(id)
    if (!existingItem) {
      throw new Error('Item not found')
    }
    const updatedItem: WardrobeItem = {
      ...existingItem,
      ...updates,
      updatedAt: new Date(),
    }
    return updatedItem
  }
)

export const deleteWardrobeItem = createAsyncThunk(
  'wardrobe/deleteItem',
  async (itemId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 500))
    return itemId
  }
)

export const incrementTimesWorn = createAsyncThunk(
  'wardrobe/incrementTimesWorn',
  async (itemId: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))
    const item = getItemById(itemId)
    if (!item) {
      throw new Error('Item not found')
    }
    return { itemId, timesWorn: item.timesWorn + 1 }
  }
)

const wardrobeSlice = createSlice({
  name: 'wardrobe',
  initialState,
  reducers: {
    setItems: (state, action: PayloadAction<WardrobeItem[]>) => {
      state.items = action.payload
    },
    setSelectedCategory: (state, action: PayloadAction<WardrobeItem['category'] | 'all'>) => {
      state.selectedCategory = action.payload
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload
    },
    setSortBy: (
      state,
      action: PayloadAction<'date' | 'timesWorn' | 'price' | 'brand' | 'name'>
    ) => {
      state.sortBy = action.payload
    },
    setFilters: (
      state,
      action: PayloadAction<{
        brand?: string
        color?: string
        season?: string
        minPrice?: number
        maxPrice?: number
      }>
    ) => {
      state.filters = action.payload
    },
    clearFilters: (state) => {
      state.filters = {}
      state.searchQuery = ''
      state.selectedCategory = 'all'
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    // Fetch Wardrobe
    builder
      .addCase(fetchWardrobe.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchWardrobe.fulfilled, (state, action) => {
        state.isLoading = false
        state.wardrobe = action.payload
        state.items = action.payload.items
      })
      .addCase(fetchWardrobe.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to fetch wardrobe'
      })

    // Fetch Stats
    builder
      .addCase(fetchWardrobeStats.pending, (state) => {
        state.isLoadingStats = true
      })
      .addCase(fetchWardrobeStats.fulfilled, (state, action) => {
        state.isLoadingStats = false
        state.stats = action.payload
      })
      .addCase(fetchWardrobeStats.rejected, (state, action) => {
        state.isLoadingStats = false
        state.error = action.error.message || 'Failed to fetch stats'
      })

    // Add Item
    builder
      .addCase(addWardrobeItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(addWardrobeItem.fulfilled, (state, action) => {
        state.isLoading = false
        state.items.push(action.payload)
        if (state.wardrobe) {
          state.wardrobe.items.push(action.payload)
          state.wardrobe.totalItems += 1
        }
      })
      .addCase(addWardrobeItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to add item'
      })

    // Update Item
    builder
      .addCase(updateWardrobeItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateWardrobeItem.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.items.findIndex((item) => item.id === action.payload.id)
        if (index !== -1) {
          state.items[index] = action.payload
        }
        if (state.wardrobe) {
          const wardrobeIndex = state.wardrobe.items.findIndex(
            (item) => item.id === action.payload.id
          )
          if (wardrobeIndex !== -1) {
            state.wardrobe.items[wardrobeIndex] = action.payload
          }
        }
      })
      .addCase(updateWardrobeItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to update item'
      })

    // Delete Item
    builder
      .addCase(deleteWardrobeItem.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteWardrobeItem.fulfilled, (state, action) => {
        state.isLoading = false
        state.items = state.items.filter((item) => item.id !== action.payload)
        if (state.wardrobe) {
          state.wardrobe.items = state.wardrobe.items.filter((item) => item.id !== action.payload)
          state.wardrobe.totalItems -= 1
        }
      })
      .addCase(deleteWardrobeItem.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.error.message || 'Failed to delete item'
      })

    // Increment Times Worn
    builder.addCase(incrementTimesWorn.fulfilled, (state, action) => {
      const index = state.items.findIndex((item) => item.id === action.payload.itemId)
      if (index !== -1) {
        state.items[index].timesWorn = action.payload.timesWorn
      }
    })
  },
})

export const {
  setItems,
  setSelectedCategory,
  setSearchQuery,
  setSortBy,
  setFilters,
  clearFilters,
  clearError,
} = wardrobeSlice.actions

export default wardrobeSlice.reducer
