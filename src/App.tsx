import { Toaster } from '@/presentation/components/ui/toaster'
import { ToastProvider } from '@/presentation/components/common/ToastProvider'
import { AppRoutes } from '@/presentation/routes'

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster />
      <ToastProvider />
    </>
  )
}

export default App
