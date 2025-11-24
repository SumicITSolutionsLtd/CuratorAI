import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit'
import { User, UserPreferences, UserProfile } from '@domain/entities/User'
import { UserRepository } from '@infrastructure/repositories/UserRepository'
import { extractErrorMessage } from '@/shared/utils/errorHandling'

const userRepository = new UserRepository()

interface UserState {
  preferences: UserPreferences | null
  selectedUser: User | null
  searchResults: User[]
  followers: User[]
  following: User[]
  isLoading: boolean
  error: string | null
}

const initialState: UserState = {
  preferences: null,
  selectedUser: null,
  searchResults: [],
  followers: [],
  following: [],
  isLoading: false,
  error: null,
}

// Async thunks
export const getUserById = createAsyncThunk(
  'user/getUserById',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await userRepository.getUserById(userId)
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to get user'))
    }
  }
)

export const updateProfile = createAsyncThunk(
  'user/updateProfile',
  async (
    { userId, profile }: { userId: string; profile: Partial<UserProfile> },
    { rejectWithValue }
  ) => {
    try {
      return await userRepository.updateProfile(userId, profile)
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to update profile'))
    }
  }
)

export const updatePreferences = createAsyncThunk(
  'user/updatePreferences',
  async (
    { userId, preferences }: { userId: string; preferences: Partial<UserPreferences> },
    { rejectWithValue }
  ) => {
    try {
      return await userRepository.updatePreferences(userId, preferences)
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to update preferences'))
    }
  }
)

export const searchUsers = createAsyncThunk(
  'user/searchUsers',
  async ({ query, limit }: { query: string; limit?: number }, { rejectWithValue }) => {
    try {
      return await userRepository.searchUsers(query, limit)
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to search users'))
    }
  }
)

export const followUser = createAsyncThunk(
  'user/followUser',
  async (
    { userId, targetUserId }: { userId: string; targetUserId: string },
    { rejectWithValue }
  ) => {
    try {
      await userRepository.followUser(userId, targetUserId)
      return targetUserId
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to follow user'))
    }
  }
)

export const unfollowUser = createAsyncThunk(
  'user/unfollowUser',
  async (
    { userId, targetUserId }: { userId: string; targetUserId: string },
    { rejectWithValue }
  ) => {
    try {
      await userRepository.unfollowUser(userId, targetUserId)
      return targetUserId
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to unfollow user'))
    }
  }
)

export const getFollowers = createAsyncThunk(
  'user/getFollowers',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await userRepository.getFollowers(userId)
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to get followers'))
    }
  }
)

export const getFollowing = createAsyncThunk(
  'user/getFollowing',
  async (userId: string, { rejectWithValue }) => {
    try {
      return await userRepository.getFollowing(userId)
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to get following'))
    }
  }
)

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId: string, { rejectWithValue }) => {
    try {
      await userRepository.deleteUser(userId)
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to delete user'))
    }
  }
)

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setPreferences: (state, action: PayloadAction<UserPreferences>) => {
      state.preferences = action.payload
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null
    },
    clearSearchResults: (state) => {
      state.searchResults = []
    },
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Get user by ID
      .addCase(getUserById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getUserById.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedUser = action.payload
      })
      .addCase(getUserById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update profile
      .addCase(updateProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.selectedUser = action.payload
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Update preferences
      .addCase(updatePreferences.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updatePreferences.fulfilled, (state, action) => {
        state.isLoading = false
        state.preferences = action.payload.preferences
      })
      .addCase(updatePreferences.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Search users
      .addCase(searchUsers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(searchUsers.fulfilled, (state, action) => {
        state.isLoading = false
        state.searchResults = action.payload
      })
      .addCase(searchUsers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Follow user
      .addCase(followUser.fulfilled, () => {
        // Could add optimistic update here
      })
      // Unfollow user
      .addCase(unfollowUser.fulfilled, () => {
        // Could add optimistic update here
      })
      // Get followers
      .addCase(getFollowers.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getFollowers.fulfilled, (state, action) => {
        state.isLoading = false
        state.followers = action.payload
      })
      .addCase(getFollowers.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Get following
      .addCase(getFollowing.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(getFollowing.fulfilled, (state, action) => {
        state.isLoading = false
        state.following = action.payload
      })
      .addCase(getFollowing.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { setPreferences, clearSelectedUser, clearSearchResults, clearError } =
  userSlice.actions
export default userSlice.reducer
