import { Navigate, Outlet } from 'react-router-dom'
import { selectIsAuthenticated } from '@/features/auth/model/selectors'
import { routes } from '@/shared/config/routes'
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector'

export const PublicOnlyRoute = () => {
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (isAuthenticated) {
    return <Navigate to={routes.dashboard} replace />
  }

  return <Outlet />
}
