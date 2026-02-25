import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { selectIsAuthenticated } from '@/features/auth/model/selectors'
import { routes } from '@/shared/config/routes'
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector'

export const ProtectedRoute = () => {
  const location = useLocation()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (!isAuthenticated) {
    return <Navigate to={routes.login} replace state={{ from: location.pathname }} />
  }

  return <Outlet />
}
