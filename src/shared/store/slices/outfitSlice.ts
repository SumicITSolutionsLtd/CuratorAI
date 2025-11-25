import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { Outfit, OutfitRecommendation, OutfitFilter } from '@domain/entities/Outfit'
import { OutfitRepository } from '@infrastructure/repositories/OutfitRepository'
import { extractAPIErrorMessage } from '@/shared/utils/apiErrorHandler'

const outfitRepository = new OutfitRepository()

interface OutfitState {
  recommendations: OutfitRecommendation[]
  savedOutfits: Outfit[]
  selectedOutfit: Outfit | null
  currentPage: number
  hasMore: boolean
  total: number
  isLoading: boolean
  error: string | null
  filters: OutfitFilter
}

const initialState: OutfitState = {
  recommendations: [],
  savedOutfits: [],
  selectedOutfit: null,
  currentPage: 1,
  hasMore: true,
  total: 0,
  isLoading: false,
  error: null,
  filters: {},
}

// ==================== OUTFIT RECOMMENDATIONS ====================

export const fetchRecommendations = createAsyncThunk(
  'outfit/fetchRecommendations',
  async (
    { userId, page = 1, limit = 12 }: { userId: string; page?: number; limit?: number },
    { getState, rejectWithValue }
  ) => {
    try {
      const state = getState() as any
      const filters = state.outfit.filters
      return await outfitRepository.getRecommendations(userId, filters, page, limit)
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to fetch recommendations'))
    }
  }
)

// ==================== OUTFIT MANAGEMENT ====================

export const fetchOutfitById = createAsyncThunk(
  'outfit/fetchOutfitById',
  async (outfitId: string, { rejectWithValue }) => {
    try {
      return await outfitRepository.getOutfitById(outfitId)
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to fetch outfit'))
    }
  }
)

export const createOutfit = createAsyncThunk(
  'outfit/createOutfit',
  async (outfit: Omit<Outfit, 'id' | 'createdAt' | 'updatedAt'>, { rejectWithValue }) => {
    try {
      return await outfitRepository.createOutfit(outfit)
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to create outfit'))
    }
  }
)

export const updateOutfit = createAsyncThunk(
  'outfit/updateOutfit',
  async (
    { outfitId, updates }: { outfitId: string; updates: Partial<Outfit> },
    { rejectWithValue }
  ) => {
    try {
      return await outfitRepository.updateOutfit(outfitId, updates)
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to update outfit'))
    }
  }
)

export const deleteOutfit = createAsyncThunk(
  'outfit/deleteOutfit',
  async (outfitId: string, { rejectWithValue }) => {
    try {
      await outfitRepository.deleteOutfit(outfitId)
      return outfitId
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to delete outfit'))
    }
  }
)

// ==================== OUTFIT ACTIONS ====================

export const likeOutfit = createAsyncThunk(
  'outfit/likeOutfit',
  async ({ userId, outfitId }: { userId: string; outfitId: string }, { rejectWithValue }) => {
    try {
      await outfitRepository.likeOutfit(userId, outfitId)
      return outfitId
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to like outfit'))
    }
  }
)

export const unlikeOutfit = createAsyncThunk(
  'outfit/unlikeOutfit',
  async ({ userId, outfitId }: { userId: string; outfitId: string }, { rejectWithValue }) => {
    try {
      await outfitRepository.unlikeOutfit(userId, outfitId)
      return outfitId
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to unlike outfit'))
    }
  }
)

export const saveOutfit = createAsyncThunk(
  'outfit/saveOutfit',
  async ({ userId, outfitId }: { userId: string; outfitId: string }, { rejectWithValue }) => {
    try {
      await outfitRepository.saveOutfit(userId, outfitId)
      return outfitId
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to save outfit'))
    }
  }
)

export const unsaveOutfit = createAsyncThunk(
  'outfit/unsaveOutfit',
  async ({ userId, outfitId }: { userId: string; outfitId: string }, { rejectWithValue }) => {
    try {
      await outfitRepository.unsaveOutfit(userId, outfitId)
      return outfitId
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to unsave outfit'))
    }
  }
)

// ==================== SAVED OUTFITS ====================

export const fetchSavedOutfits = createAsyncThunk(
  'outfit/fetchSavedOutfits',
  async (
    { userId, page = 1, limit = 12 }: { userId: string; page?: number; limit?: number },
    { rejectWithValue }
  ) => {
    try {
      return await outfitRepository.getSavedOutfits(userId, page, limit)
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to fetch saved outfits'))
    }
  }
)

// ==================== FEEDBACK ====================

export const provideFeedback = createAsyncThunk(
  'outfit/provideFeedback',
  async (
    { outfitId, helpful, feedback }: { outfitId: string; helpful: boolean; feedback?: string },
    { rejectWithValue }
  ) => {
    try {
      await outfitRepository.provideFeedback(outfitId, helpful, feedback)
      return outfitId
    } catch (error: any) {
      return rejectWithValue(extractAPIErrorMessage(error, 'Failed to provide feedback'))
    }
  }
)

// ==================== SLICE ====================

const outfitSlice = createSlice({
  name: 'outfit',
  initialState,
  reducers: {
    setFilters: (state, action: PayloadAction<OutfitFilter>) => {
      state.filters = action.payload
      state.currentPage = 1
      state.recommendations = []
    },
    clearRecommendations: (state) => {
      state.recommendations = []
      state.currentPage = 1
      state.hasMore = true
    },
    clearSelectedOutfit: (state) => {
      state.selectedOutfit = null
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // ==================== FETCH RECOMMENDATIONS ====================
      .addCase(fetchRecommendations.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload.currentPage === 1) {
          state.recommendations = action.payload.results
        } else {
          state.recommendations.push(...action.payload.results)
        }
        state.currentPage = action.payload.currentPage
        state.hasMore = action.payload.hasMore
        state.total = action.payload.count
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // ==================== FETCH OUTFIT BY ID ====================
      .addCase(fetchOutfitById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchOutfitById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedOutfit = action.payload
      })
      .addCase(fetchOutfitById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // ==================== CREATE OUTFIT ====================
      .addCase(createOutfit.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createOutfit.fulfilled, (state, action) => {
        state.isLoading = false
        // Add new outfit to recommendations
        state.recommendations = [action.payload as any, ...state.recommendations]
      })
      .addCase(createOutfit.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // ==================== UPDATE OUTFIT ====================
      .addCase(updateOutfit.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateOutfit.fulfilled, (state, action) => {
        state.isLoading = false
        const index = state.recommendations.findIndex((outfit) => outfit.id === action.payload.id)
        if (index !== -1) {
          state.recommendations[index] = action.payload as any
        }
        if (state.selectedOutfit?.id === action.payload.id) {
          state.selectedOutfit = action.payload
        }
      })
      .addCase(updateOutfit.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // ==================== DELETE OUTFIT ====================
      .addCase(deleteOutfit.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(deleteOutfit.fulfilled, (state, action) => {
        state.isLoading = false
        state.recommendations = state.recommendations.filter(
          (outfit) => outfit.id !== action.payload
        )
        state.savedOutfits = state.savedOutfits.filter((outfit) => outfit.id !== action.payload)
        if (state.selectedOutfit?.id === action.payload) {
          state.selectedOutfit = null
        }
      })
      .addCase(deleteOutfit.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // ==================== LIKE OUTFIT ====================
      .addCase(likeOutfit.fulfilled, (state, action) => {
        const outfit = state.recommendations.find((o) => o.id === action.payload)
        if (outfit) {
          outfit.isLiked = true
          outfit.likes += 1
        }
        if (state.selectedOutfit?.id === action.payload) {
          state.selectedOutfit.isLiked = true
          state.selectedOutfit.likes = (state.selectedOutfit.likes || 0) + 1
        }
      })

      // ==================== UNLIKE OUTFIT ====================
      .addCase(unlikeOutfit.fulfilled, (state, action) => {
        const outfit = state.recommendations.find((o) => o.id === action.payload)
        if (outfit) {
          outfit.isLiked = false
          outfit.likes = Math.max(0, outfit.likes - 1)
        }
        if (state.selectedOutfit?.id === action.payload) {
          state.selectedOutfit.isLiked = false
          state.selectedOutfit.likes = Math.max(0, (state.selectedOutfit.likes || 0) - 1)
        }
      })

      // ==================== SAVE OUTFIT ====================
      .addCase(saveOutfit.fulfilled, (state, action) => {
        const outfit = state.recommendations.find((o) => o.id === action.payload)
        if (outfit) {
          outfit.isSaved = true
        }
        if (state.selectedOutfit?.id === action.payload) {
          state.selectedOutfit.isSaved = true
        }
      })

      // ==================== UNSAVE OUTFIT ====================
      .addCase(unsaveOutfit.fulfilled, (state, action) => {
        const outfit = state.recommendations.find((o) => o.id === action.payload)
        if (outfit) {
          outfit.isSaved = false
        }
        if (state.selectedOutfit?.id === action.payload) {
          state.selectedOutfit.isSaved = false
        }
        // Remove from saved outfits
        state.savedOutfits = state.savedOutfits.filter((o) => o.id !== action.payload)
      })

      // ==================== FETCH SAVED OUTFITS ====================
      .addCase(fetchSavedOutfits.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchSavedOutfits.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload.currentPage === 1) {
          state.savedOutfits = action.payload.results
        } else {
          state.savedOutfits.push(...action.payload.results)
        }
        state.currentPage = action.payload.currentPage
        state.hasMore = action.payload.hasMore
        state.total = action.payload.count
      })
      .addCase(fetchSavedOutfits.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })

      // ==================== PROVIDE FEEDBACK ====================
      .addCase(provideFeedback.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(provideFeedback.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(provideFeedback.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setFilters, clearRecommendations, clearSelectedOutfit, clearError } =
  outfitSlice.actions
export default outfitSlice.reducer
