import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { OutfitRecommendation, OutfitFilter } from '@domain/entities/Outfit'
import { OutfitRepository } from '@infrastructure/repositories/OutfitRepository'

const outfitRepository = new OutfitRepository()

interface OutfitState {
  recommendations: OutfitRecommendation[]
  currentPage: number
  hasMore: boolean
  total: number
  isLoading: boolean
  error: string | null
  filters: OutfitFilter
}

const initialState: OutfitState = {
  recommendations: [],
  currentPage: 1,
  hasMore: true,
  total: 0,
  isLoading: false,
  error: null,
  filters: {},
}

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
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch recommendations')
    }
  }
)

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
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecommendations.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.isLoading = false
        if (action.payload.page === 1) {
          state.recommendations = action.payload.data
        } else {
          state.recommendations.push(...action.payload.data)
        }
        state.currentPage = action.payload.page
        state.hasMore = action.payload.hasMore
        state.total = action.payload.total
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setFilters, clearRecommendations } = outfitSlice.actions
export default outfitSlice.reducer
