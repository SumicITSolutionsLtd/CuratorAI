import { Toaster } from '@/presentation/components/ui/toaster'
import { AppRoutes } from '@/presentation/routes'

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster />
    </>
  )
}

export default App
