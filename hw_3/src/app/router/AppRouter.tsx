import { Suspense, lazy } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ProtectedRoute } from '@/app/router/guards/ProtectedRoute'
import { PublicOnlyRoute } from '@/app/router/guards/PublicOnlyRoute'
import { routes } from '@/shared/config/routes'
import { Loader } from '@/shared/ui/loader/Loader'
import { AppLayout } from '@/widgets/app-layout/ui/AppLayout'

const DashboardPage = lazy(() => import('@/pages/dashboard/ui/DashboardPage'))
const LoginPage = lazy(() => import('@/pages/login/ui/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/register/ui/RegisterPage'))
const ProductsPage = lazy(() => import('@/pages/products/ui/ProductsPage'))
const ProductDetailsPage = lazy(() => import('@/pages/product-details/ui/ProductDetailsPage'))
const ProfilePage = lazy(() => import('@/pages/profile/ui/ProfilePage'))
const SettingsPage = lazy(() => import('@/pages/settings/ui/SettingsPage'))
const LogoutPage = lazy(() => import('@/pages/logout/ui/LogoutPage'))
const NotFoundPage = lazy(() => import('@/pages/not-found/ui/NotFoundPage'))

export const AppRouter = () => {
  return (
    <Suspense fallback={<Loader centered />}>
      <Routes>
        <Route element={<PublicOnlyRoute />}>
          <Route path={routes.login} element={<LoginPage />} />
          <Route path={routes.register} element={<RegisterPage />} />
        </Route>

        <Route element={<ProtectedRoute />}>
          <Route element={<AppLayout />}>
            <Route path={routes.dashboard} element={<DashboardPage />} />
            <Route path={routes.products} element={<ProductsPage />} />
            <Route path={`${routes.products}/:id`} element={<ProductDetailsPage />} />
            <Route path={routes.profile} element={<ProfilePage />} />
            <Route path={routes.settings} element={<SettingsPage />} />
            <Route path={routes.logout} element={<LogoutPage />} />
          </Route>
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  )
}
