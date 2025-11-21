import { useEffect } from 'react'
import { Toaster } from '@/presentation/components/ui/toaster'
import { ToastProvider } from '@/presentation/components/common/ToastProvider'
import { AppRoutes } from '@/presentation/routes'
import { SessionRecovery } from '@/presentation/components/auth/SessionRecovery'
import { initGoogleOAuth, initFacebookSDK } from '@/shared/utils/oauth'

function App() {
  useEffect(() => {
    // Initialize OAuth SDKs on app load
    const initializeOAuth = async () => {
      // Initialize Google OAuth if configured
      if (import.meta.env.VITE_GOOGLE_CLIENT_ID) {
        try {
          await initGoogleOAuth()
          console.log('✅ Google OAuth initialized')
        } catch (error) {
          console.warn('⚠️ Failed to initialize Google OAuth:', error)
        }
      }

      // Initialize Facebook SDK if configured
      if (import.meta.env.VITE_FACEBOOK_APP_ID) {
        try {
          await initFacebookSDK()
          console.log('✅ Facebook OAuth initialized')
        } catch (error) {
          console.warn('⚠️ Failed to initialize Facebook OAuth:', error)
        }
      }
    }

    initializeOAuth()
  }, [])

  return (
    <SessionRecovery>
      <AppRoutes />
      <Toaster />
      <ToastProvider />
    </SessionRecovery>
  )
}

export default App
