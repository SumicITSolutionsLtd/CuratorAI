import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import {
  VisualSearchResult,
  VisualSearchRequest,
  ImageProcessingStatus,
} from '@domain/entities/Search'
import { SearchRepository } from '@infrastructure/repositories/SearchRepository'

const searchRepository = new SearchRepository()

interface SearchState {
  results: VisualSearchResult[]
  recentSearches: { id: string; imageUrl: string; timestamp: Date }[]
  uploadedImageUrl: string | null
  processingStatus: ImageProcessingStatus | null
  isProcessing: boolean
  isLoading: boolean
  error: string | null
}

const initialState: SearchState = {
  results: [],
  recentSearches: [],
  uploadedImageUrl: null,
  processingStatus: null,
  isProcessing: false,
  isLoading: false,
  error: null,
}

// ==================== VISUAL SEARCH ====================

export const performVisualSearch = createAsyncThunk(
  'search/performVisualSearch',
  async (request: VisualSearchRequest, { rejectWithValue }) => {
    try {
      return await searchRepository.performVisualSearch(request)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Visual search failed')
    }
  }
)

export const uploadSearchImage = createAsyncThunk(
  'search/uploadSearchImage',
  async (image: File, { rejectWithValue }) => {
    try {
      return await searchRepository.uploadSearchImage(image)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Image upload failed')
    }
  }
)

export const getProcessingStatus = createAsyncThunk(
  'search/getProcessingStatus',
  async (searchId: string, { rejectWithValue }) => {
    try {
      return await searchRepository.getProcessingStatus(searchId)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get processing status')
    }
  }
)

// ==================== SEARCH HISTORY ====================

export const getRecentSearches = createAsyncThunk(
  'search/getRecentSearches',
  async ({ userId, limit = 10 }: { userId: string; limit?: number }, { rejectWithValue }) => {
    try {
      return await searchRepository.getRecentSearches(userId, limit)
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recent searches')
    }
  }
)

export const deleteSearchHistory = createAsyncThunk(
  'search/deleteSearchHistory',
  async (userId: string, { rejectWithValue }) => {
    try {
      await searchRepository.deleteSearchHistory(userId)
      return true
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete search history')
    }
  }
)

// ==================== SLICE ====================

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    clearResults: (state) => {
      state.results = []
      state.uploadedImageUrl = null
      state.processingStatus = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // ==================== PERFORM VISUAL SEARCH ====================
      .addCase(performVisualSearch.pending, (state) => {
        state.isProcessing = true
        state.isLoading = true
        state.error = null
      })
      .addCase(performVisualSearch.fulfilled, (state, action) => {
        state.isProcessing = false
        state.isLoading = false
        state.results = action.payload.results
      })
      .addCase(performVisualSearch.rejected, (state, action) => {
        state.isProcessing = false
        state.isLoading = false
        state.error = action.payload as string
      })

      // ==================== UPLOAD SEARCH IMAGE ====================
      .addCase(uploadSearchImage.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(uploadSearchImage.fulfilled, (state, action) => {
        state.isLoading = false
        state.uploadedImageUrl = action.payload
      })
      .addCase(uploadSearchImage.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // ==================== GET PROCESSING STATUS ====================
      .addCase(getProcessingStatus.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getProcessingStatus.fulfilled, (state, action) => {
        state.isLoading = false
        state.processingStatus = action.payload
        state.isProcessing =
          action.payload.status !== 'completed' && action.payload.status !== 'failed'
      })
      .addCase(getProcessingStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // ==================== GET RECENT SEARCHES ====================
      .addCase(getRecentSearches.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getRecentSearches.fulfilled, (state, action) => {
        state.isLoading = false
        state.recentSearches = action.payload
      })
      .addCase(getRecentSearches.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // ==================== DELETE SEARCH HISTORY ====================
      .addCase(deleteSearchHistory.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteSearchHistory.fulfilled, (state) => {
        state.isLoading = false
        state.recentSearches = []
      })
      .addCase(deleteSearchHistory.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearResults, clearError } = searchSlice.actions
export default searchSlice.reducer
