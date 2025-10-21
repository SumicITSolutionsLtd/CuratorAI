import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { VisualSearchResult } from '@domain/entities/Search'

interface SearchState {
  results: VisualSearchResult[]
  isProcessing: boolean
  uploadedImageUrl: string | null
}

const initialState: SearchState = {
  results: [],
  isProcessing: false,
  uploadedImageUrl: null,
}

const searchSlice = createSlice({
  name: 'search',
  initialState,
  reducers: {
    setResults: (state, action: PayloadAction<VisualSearchResult[]>) => {
      state.results = action.payload
    },
    setProcessing: (state, action: PayloadAction<boolean>) => {
      state.isProcessing = action.payload
    },
    setUploadedImage: (state, action: PayloadAction<string | null>) => {
      state.uploadedImageUrl = action.payload
    },
  },
})

export const { setResults, setProcessing, setUploadedImage } = searchSlice.actions
export default searchSlice.reducer
