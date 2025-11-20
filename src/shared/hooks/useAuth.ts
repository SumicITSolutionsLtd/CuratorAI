import { useAppSelector } from './useAppSelector'
import { useAppDispatch } from './useAppDispatch'
import { login, register, logout, loginWithOAuth } from '../store/slices/authSlice'
import { AuthCredentials, RegisterData, OAuthProvider } from '@domain/entities/User'
import { loginWithGoogle, loginWithFacebook } from '../utils/oauth'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth)

  const handleLogin = async (credentials: AuthCredentials) => {
    await dispatch(login(credentials))
  }

  const handleRegister = async (data: RegisterData) => {
    await dispatch(register(data))
  }

  const handleLogout = async () => {
    await dispatch(logout())
  }

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    try {
      let token: string
      if (provider === 'google') {
        token = await loginWithGoogle()
      } else {
        token = await loginWithFacebook()
      }

      const oauthProvider: OAuthProvider = { provider, token }
      await dispatch(loginWithOAuth(oauthProvider))
    } catch (error: unknown) {
      // Re-throw the error so it can be caught by the component
      throw error
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
    loginWithOAuth: handleOAuthLogin,
  }
}
