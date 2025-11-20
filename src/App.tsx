import { Toaster } from '@/presentation/components/ui/toaster'
import { ToastProvider } from '@/presentation/components/common/ToastProvider'
import { AppRoutes } from '@/presentation/routes'
import { SessionRecovery } from '@/presentation/components/auth/SessionRecovery'

function App() {
  return (
    <SessionRecovery>
      <AppRoutes />
      <Toaster />
      <ToastProvider />
    </SessionRecovery>
  )
}

export default App
