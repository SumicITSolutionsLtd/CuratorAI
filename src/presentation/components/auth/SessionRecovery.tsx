import { useEffect, useState } from 'react'
import { useAppDispatch } from '@/shared/hooks/useAppDispatch'
import { useAppSelector } from '@/shared/hooks/useAppSelector'
import { getCurrentUser } from '@/shared/store/slices/authSlice'

interface SessionRecoveryProps {
  children: React.ReactNode
}

export const SessionRecovery: React.FC<SessionRecoveryProps> = ({ children }) => {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('curatorai_access_token')

      // Only check session if we have a token but are not authenticated
      if (token && !isAuthenticated) {
        try {
          await dispatch(getCurrentUser()).unwrap()
        } catch (error) {
          // Session invalid, clear tokens
          localStorage.removeItem('curatorai_access_token')
          localStorage.removeItem('curatorai_refresh_token')
        }
      }

      setIsChecking(false)
    }

    checkSession()
  }, [dispatch, isAuthenticated])

  // Show loading screen while checking session
  if (isChecking) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
