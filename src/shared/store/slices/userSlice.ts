import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { UserPreferences } from '@domain/entities/User'

interface UserState {
  preferences: UserPreferences | null
}

const initialState: UserState = {
  preferences: null,
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setPreferences: (state, action: PayloadAction<UserPreferences>) => {
      state.preferences = action.payload
    },
  },
})

export const { setPreferences } = userSlice.actions
export default userSlice.reducer
