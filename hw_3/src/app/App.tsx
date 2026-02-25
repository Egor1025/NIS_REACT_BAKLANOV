import { useAuthBootstrap } from '@/features/auth/model/useAuthBootstrap'
import { useApplySettings } from '@/features/settings/model/useApplySettings'
import { Loader } from '@/shared/ui/loader/Loader'
import { ErrorBoundary } from '@/shared/ui/error-state/ErrorBoundary'
import { AppRouter } from '@/app/router/AppRouter'

const AppContent = () => {
  useApplySettings()

  const { isInitializing } = useAuthBootstrap()

  if (isInitializing) {
    return <Loader centered />
  }

  return <AppRouter />
}

const App = () => {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  )
}

export default App
