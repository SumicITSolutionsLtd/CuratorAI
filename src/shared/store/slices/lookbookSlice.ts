import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { Lookbook, LookbookFilter } from '@domain/entities/Lookbook'
import { LookbookRepository } from '@infrastructure/repositories/LookbookRepository'

const lookbookRepository = new LookbookRepository()

interface LookbookState {
  lookbooks: Lookbook[]
  featuredLookbooks: Lookbook[]
  selectedLookbook: Lookbook | null
  currentPage: number
  totalPages: number
  hasMore: boolean
  isLoading: boolean
  error: string | null
}

const initialState: LookbookState = {
  lookbooks: [],
  featuredLookbooks: [],
  selectedLookbook: null,
  currentPage: 1,
  totalPages: 1,
  hasMore: false,
  isLoading: false,
  error: null,
}

// Async thunks
export const fetchLookbooks = createAsyncThunk(
  'lookbook/fetchLookbooks',
  async (
    { filter, page, limit }: { filter?: LookbookFilter; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      return await lookbookRepository.getLookbooks(filter, page, limit)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lookbooks')
    }
  }
)

export const fetchFeaturedLookbooks = createAsyncThunk(
  'lookbook/fetchFeatured',
  async (limit: number | undefined, { rejectWithValue }) => {
    try {
      return await lookbookRepository.getFeaturedLookbooks(limit)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch featured lookbooks')
    }
  }
)

export const fetchLookbookById = createAsyncThunk(
  'lookbook/fetchById',
  async (lookbookId: string, { rejectWithValue }) => {
    try {
      return await lookbookRepository.getLookbookById(lookbookId)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch lookbook')
    }
  }
)

export const createLookbook = createAsyncThunk(
  'lookbook/create',
  async (lookbook: Omit<Lookbook, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      return await lookbookRepository.createLookbook(lookbook)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create lookbook')
    }
  }
)

export const updateLookbook = createAsyncThunk(
  'lookbook/update',
  async ({ lookbookId, updates }: { lookbookId: string; updates: Partial<Lookbook> }, { rejectWithValue }) => {
    try {
      return await lookbookRepository.updateLookbook(lookbookId, updates)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update lookbook')
    }
  }
)

export const deleteLookbook = createAsyncThunk(
  'lookbook/delete',
  async (lookbookId: string, { rejectWithValue }) => {
    try {
      await lookbookRepository.deleteLookbook(lookbookId)
      return lookbookId
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete lookbook')
    }
  }
)

export const likeLookbook = createAsyncThunk(
  'lookbook/like',
  async ({ userId, lookbookId }: { userId: string; lookbookId: string }, { rejectWithValue }) => {
    try {
      await lookbookRepository.likeLookbook(userId, lookbookId)
      return lookbookId
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to like lookbook')
    }
  }
)

export const unlikeLookbook = createAsyncThunk(
  'lookbook/unlike',
  async ({ userId, lookbookId }: { userId: string; lookbookId: string }, { rejectWithValue }) => {
    try {
      await lookbookRepository.unlikeLookbook(userId, lookbookId)
      return lookbookId
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to unlike lookbook')
    }
  }
)

const lookbookSlice = createSlice({
  name: 'lookbook',
  initialState,
  reducers: {
    clearSelectedLookbook: (state) => {
      state.selectedLookbook = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch lookbooks
      .addCase(fetchLookbooks.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchLookbooks.fulfilled, (state, action) => {
        state.isLoading = false
        state.lookbooks = action.payload.results
        state.totalPages = action.payload.totalPages
        state.currentPage = action.payload.currentPage
        state.hasMore = action.payload.hasMore
      })
      .addCase(fetchLookbooks.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Fetch featured lookbooks
      .addCase(fetchFeaturedLookbooks.fulfilled, (state, action) => {
        state.featuredLookbooks = action.payload
      })
      // Fetch lookbook by ID
      .addCase(fetchLookbookById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchLookbookById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedLookbook = action.payload
      })
      .addCase(fetchLookbookById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Create lookbook
      .addCase(createLookbook.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createLookbook.fulfilled, (state, action) => {
        state.isLoading = false
        state.lookbooks.unshift(action.payload)
      })
      .addCase(createLookbook.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update lookbook
      .addCase(updateLookbook.fulfilled, (state, action) => {
        const index = state.lookbooks.findIndex((l) => l.id === action.payload.id)
        if (index !== -1) {
          state.lookbooks[index] = action.payload
        }
        if (state.selectedLookbook?.id === action.payload.id) {
          state.selectedLookbook = action.payload
        }
      })
      // Delete lookbook
      .addCase(deleteLookbook.fulfilled, (state, action) => {
        state.lookbooks = state.lookbooks.filter((l) => l.id !== action.payload)
        if (state.selectedLookbook?.id === action.payload) {
          state.selectedLookbook = null
        }
      })
      // Like lookbook
      .addCase(likeLookbook.fulfilled, (state, action) => {
        const lookbook = state.lookbooks.find((l) => l.id === action.payload)
        if (lookbook) {
          lookbook.likes += 1
        }
        if (state.selectedLookbook?.id === action.payload) {
          state.selectedLookbook.likes += 1
        }
      })
      // Unlike lookbook
      .addCase(unlikeLookbook.fulfilled, (state, action) => {
        const lookbook = state.lookbooks.find((l) => l.id === action.payload)
        if (lookbook) {
          lookbook.likes = Math.max(0, lookbook.likes - 1)
        }
        if (state.selectedLookbook?.id === action.payload) {
          state.selectedLookbook.likes = Math.max(0, state.selectedLookbook.likes - 1)
        }
      })
  },
})

export const { clearSelectedLookbook, clearError } = lookbookSlice.actions
export default lookbookSlice.reducer
