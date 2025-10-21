import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { User, AuthCredentials, RegisterData } from '@domain/entities/User'
import { AuthRepository } from '@infrastructure/repositories/AuthRepository'

const authRepository = new AuthRepository()

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
}

export const login = createAsyncThunk(
  'auth/login',
  async (credentials: AuthCredentials, { rejectWithValue }) => {
    try {
      const response = await authRepository.login(credentials)
      localStorage.setItem('curatorai_access_token', response.tokens.accessToken)
      localStorage.setItem('curatorai_refresh_token', response.tokens.refreshToken)
      return response.user
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Login failed')
    }
  }
)

export const register = createAsyncThunk(
  'auth/register',
  async (data: RegisterData, { rejectWithValue }) => {
    try {
      const response = await authRepository.register(data)
      localStorage.setItem('curatorai_access_token', response.tokens.accessToken)
      localStorage.setItem('curatorai_refresh_token', response.tokens.refreshToken)
      return response.user
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  await authRepository.logout()
})

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async () => {
  return await authRepository.getCurrentUser()
})

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null
        state.isAuthenticated = false
      })
      // Get current user
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        if (action.payload) {
          state.user = action.payload
          state.isAuthenticated = true
        }
      })
  },
})

export const { clearError } = authSlice.actions
export default authSlice.reducer
