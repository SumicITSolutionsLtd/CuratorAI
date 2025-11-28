import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { WardrobeItem, Wardrobe, WardrobeStats } from '@domain/entities/Wardrobe'
import { WardrobeRepository } from '@infrastructure/repositories/WardrobeRepository'
import { extractAPIErrorMessage } from '@/shared/utils/apiErrorHandler'

const wardrobeRepository = new WardrobeRepository()

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

// Helper to transform date strings to Date objects
const transformWardrobeItem = (item: any): WardrobeItem => ({
  ...item,
  createdAt: item.createdAt ? new Date(item.createdAt) : new Date(),
  updatedAt: item.updatedAt ? new Date(item.updatedAt) : new Date(),
  purchaseDate: item.purchaseDate ? new Date(item.purchaseDate) : undefined,
})

const transformWardrobe = (wardrobe: any): Wardrobe => ({
  ...wardrobe,
  items: wardrobe.items?.map(transformWardrobeItem) || [],
  createdAt: wardrobe.createdAt ? new Date(wardrobe.createdAt) : new Date(),
  updatedAt: wardrobe.updatedAt ? new Date(wardrobe.updatedAt) : new Date(),
  mostWornItem: wardrobe.mostWornItem ? transformWardrobeItem(wardrobe.mostWornItem) : undefined,
})

// Async Thunks

export const fetchWardrobe = createAsyncThunk(
  'wardrobe/fetchWardrobe',
  async (userId: string, { rejectWithValue }) => {
    try {
      const response = await wardrobeRepository.getWardrobe(userId)
      return transformWardrobe(response)
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to fetch wardrobe'))
    }
  }
)

export const fetchWardrobeStats = createAsyncThunk(
  'wardrobe/fetchWardrobeStats',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await wardrobeRepository.getWardrobeStats(userId)
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to fetch stats'))
    }
  }
)

export const addWardrobeItem = createAsyncThunk(
  'wardrobe/addItem',
  async (item: Omit<WardrobeItem, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      const response = await wardrobeRepository.addItem(item)
      return transformWardrobeItem(response)
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to add item'))
    }
  }
)

export const updateWardrobeItem = createAsyncThunk(
  'wardrobe/updateItem',
  async ({ id, updates }: { id: string; updates: Partial<WardrobeItem> }, { rejectWithValue }) => {
    try {
      const response = await wardrobeRepository.updateItem(id, updates)
      return transformWardrobeItem(response)
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to update item'))
    }
  }
)

export const deleteWardrobeItem = createAsyncThunk(
  'wardrobe/deleteItem',
  async (itemId: string, { rejectWithValue }) => {
    try {
      await wardrobeRepository.deleteItem(itemId)
      return itemId
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to delete item'))
    }
  }
)

export const incrementTimesWorn = createAsyncThunk(
  'wardrobe/incrementTimesWorn',
  async (itemId: string, { rejectWithValue }) => {
    try {
      const updatedItem = await wardrobeRepository.incrementTimesWorn(itemId)
      return {
        itemId,
        timesWorn: updatedItem.timesWorn,
        updatedAt: new Date(updatedItem.updatedAt),
      }
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to increment times worn'))
    }
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
        state.error = action.payload as string
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
        state.error = action.payload as string
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
        state.error = action.payload as string
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
        state.error = action.payload as string
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
        state.error = action.payload as string
      })

    // Increment Times Worn
    builder
      .addCase(incrementTimesWorn.pending, () => {
        // Optionally show loading state
      })
      .addCase(incrementTimesWorn.fulfilled, (state, action) => {
        const index = state.items.findIndex((item) => item.id === action.payload.itemId)
        if (index !== -1) {
          state.items[index].timesWorn = action.payload.timesWorn
          state.items[index].updatedAt = action.payload.updatedAt
        }
        if (state.wardrobe) {
          const wardrobeIndex = state.wardrobe.items.findIndex(
            (item) => item.id === action.payload.itemId
          )
          if (wardrobeIndex !== -1) {
            state.wardrobe.items[wardrobeIndex].timesWorn = action.payload.timesWorn
            state.wardrobe.items[wardrobeIndex].updatedAt = action.payload.updatedAt
          }
        }
      })
      .addCase(incrementTimesWorn.rejected, (state, action) => {
        state.error = action.payload as string
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
