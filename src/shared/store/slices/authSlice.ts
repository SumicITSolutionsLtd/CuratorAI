import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { User, AuthCredentials, RegisterData, OAuthProvider } from '@domain/entities/User'
import { AuthRepository } from '@infrastructure/repositories/AuthRepository'
import { StylePreferenceCompletion } from '@domain/repositories/IAuthRepository'
import { extractErrorMessage } from '@/shared/utils/errorHandling'

const authRepository = new AuthRepository()

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  passwordResetEmailSent: boolean
  emailVerificationSent: boolean
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  passwordResetEmailSent: false,
  emailVerificationSent: false,
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
      return rejectWithValue(extractErrorMessage(error, 'Login failed'))
    }
  }
)

export const loginWithOAuth = createAsyncThunk(
  'auth/loginWithOAuth',
  async (provider: OAuthProvider, { rejectWithValue }) => {
    try {
      const response = await authRepository.loginWithOAuth(provider)
      localStorage.setItem('curatorai_access_token', response.tokens.accessToken)
      localStorage.setItem('curatorai_refresh_token', response.tokens.refreshToken)
      return response.user
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'OAuth login failed'))
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
      return rejectWithValue(extractErrorMessage(error, 'Registration failed'))
    }
  }
)

export const logout = createAsyncThunk('auth/logout', async () => {
  await authRepository.logout()
  // Clear tokens from localStorage
  localStorage.removeItem('curatorai_access_token')
  localStorage.removeItem('curatorai_refresh_token')
})

export const getCurrentUser = createAsyncThunk('auth/getCurrentUser', async () => {
  return await authRepository.getCurrentUser()
})

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email: string, { rejectWithValue }) => {
    try {
      await authRepository.requestPasswordReset(email)
      return true
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to send reset email'))
    }
  }
)

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, newPassword }: { token: string; newPassword: string }, { rejectWithValue }) => {
    try {
      await authRepository.resetPassword(token, newPassword)
      return true
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to reset password'))
    }
  }
)

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (code: string, { rejectWithValue }) => {
    try {
      await authRepository.verifyEmail(code)
      return true
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Email verification failed'))
    }
  }
)

export const requestEmailVerification = createAsyncThunk(
  'auth/requestEmailVerification',
  async (_, { rejectWithValue }) => {
    try {
      await authRepository.requestEmailVerification()
      return true
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to send verification email'))
    }
  }
)

export const completeRegistration = createAsyncThunk(
  'auth/completeRegistration',
  async (preferences: StylePreferenceCompletion, { rejectWithValue }) => {
    try {
      return await authRepository.completeRegistration(preferences)
    } catch (error: any) {
      return rejectWithValue(extractErrorMessage(error, 'Failed to complete registration'))
    }
  }
)

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    resetPasswordResetState: (state) => {
      state.passwordResetEmailSent = false
    },
    resetEmailVerificationState: (state) => {
      state.emailVerificationSent = false
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
      // OAuth Login
      .addCase(loginWithOAuth.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginWithOAuth.fulfilled, (state, action) => {
        state.isLoading = false
        state.isAuthenticated = true
        state.user = action.payload
      })
      .addCase(loginWithOAuth.rejected, (state, action) => {
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
      // Request Password Reset
      .addCase(requestPasswordReset.pending, (state) => {
        state.isLoading = true
        state.error = null
        state.passwordResetEmailSent = false
      })
      .addCase(requestPasswordReset.fulfilled, (state) => {
        state.isLoading = false
        state.passwordResetEmailSent = true
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Verify Email
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(verifyEmail.fulfilled, (state) => {
        state.isLoading = false
        if (state.user) {
          state.user.isEmailVerified = true
        }
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Request Email Verification
      .addCase(requestEmailVerification.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(requestEmailVerification.fulfilled, (state) => {
        state.isLoading = false
        state.emailVerificationSent = true
      })
      .addCase(requestEmailVerification.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
      // Complete Registration
      .addCase(completeRegistration.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(completeRegistration.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(completeRegistration.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload as string
      })
  },
})

export const { clearError, resetPasswordResetState, resetEmailVerificationState } =
  authSlice.actions
export default authSlice.reducer
