import { useAppSelector } from './useAppSelector'
import { useAppDispatch } from './useAppDispatch'
import { login, register, logout } from '../store/slices/authSlice'
import { AuthCredentials, RegisterData } from '@domain/entities/User'

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

  return {
    user,
    isAuthenticated,
    isLoading,
    error,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  }
}
