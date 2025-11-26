import { useEffect, useState, useCallback } from 'react'
import { useAppDispatch } from '@/shared/hooks/useAppDispatch'
import { useAppSelector } from '@/shared/hooks/useAppSelector'
import { getCurrentUser, syncSessionState } from '@/shared/store/slices/authSlice'
import { sessionManager } from '@/infrastructure/services/SessionManager'

interface SessionRecoveryProps {
  children: React.ReactNode
}

export const SessionRecovery: React.FC<SessionRecoveryProps> = ({ children }) => {
  const dispatch = useAppDispatch()
  const { isAuthenticated, user } = useAppSelector((state) => state.auth)
  const [isChecking, setIsChecking] = useState(true)

  const checkSession = useCallback(async () => {
    // Check if session manager has valid tokens
    const hasValidSession = sessionManager.isAuthenticated()

    if (hasValidSession && !user) {
      try {
        await dispatch(getCurrentUser()).unwrap()
      } catch {
        // Session invalid - tokens already cleared by authSlice
      }
    } else if (!hasValidSession && isAuthenticated) {
      // Sync Redux state with SessionManager
      dispatch(syncSessionState())
    }

    setIsChecking(false)
  }, [dispatch, isAuthenticated, user])

  useEffect(() => {
    checkSession()

    // Listen for session changes from SessionManager
    const unsubscribeExpired = sessionManager.on('session-expired', () => {
      dispatch(syncSessionState())
    })

    const unsubscribeChanged = sessionManager.on('session-changed', () => {
      dispatch(syncSessionState())
    })

    return () => {
      unsubscribeExpired()
      unsubscribeChanged()
    }
  }, [checkSession, dispatch])

  // Show loading screen while checking session
  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center">
          <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
