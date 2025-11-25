import { useAppSelector } from './useAppSelector'
import { useAppDispatch } from './useAppDispatch'
import { login, register, logout, loginWithOAuth } from '../store/slices/authSlice'
import { AuthCredentials, RegisterData, OAuthProvider } from '@domain/entities/User'
import { loginWithGoogle, loginWithFacebook } from '../utils/oauth'

export const useAuth = () => {
  const dispatch = useAppDispatch()
  const { user, isAuthenticated, isLoading, error } = useAppSelector((state) => state.auth)

  const handleLogin = async (credentials: AuthCredentials) => {
    const result = await dispatch(login(credentials))
    if (login.rejected.match(result)) {
      throw new Error(result.payload as string)
    }
    return result.payload
  }

  const handleRegister = async (data: RegisterData) => {
    const result = await dispatch(register(data))
    if (register.rejected.match(result)) {
      throw new Error(result.payload as string)
    }
    return result.payload
  }

  const handleLogout = async () => {
    await dispatch(logout())
  }

  const handleOAuthLogin = async (provider: 'google' | 'facebook') => {
    let token: string
    if (provider === 'google') {
      token = await loginWithGoogle()
    } else {
      token = await loginWithFacebook()
    }

    const oauthProvider: OAuthProvider = { provider, token }
    const result = await dispatch(loginWithOAuth(oauthProvider))
    if (loginWithOAuth.rejected.match(result)) {
      throw new Error(result.payload as string)
    }
    return result.payload
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
