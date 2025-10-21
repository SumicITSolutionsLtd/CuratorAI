import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { SocialPost } from '@domain/entities/Social'

interface SocialState {
  feed: SocialPost[]
  currentFeedType: 'following' | 'forYou' | 'trending'
}

const initialState: SocialState = {
  feed: [],
  currentFeedType: 'forYou',
}

const socialSlice = createSlice({
  name: 'social',
  initialState,
  reducers: {
    setFeed: (state, action: PayloadAction<SocialPost[]>) => {
      state.feed = action.payload
    },
    setFeedType: (state, action: PayloadAction<'following' | 'forYou' | 'trending'>) => {
      state.currentFeedType = action.payload
    },
  },
})

export const { setFeed, setFeedType } = socialSlice.actions
export default socialSlice.reducer
