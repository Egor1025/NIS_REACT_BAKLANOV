import { NavLink, Outlet } from 'react-router-dom'
import { getFullName } from '@/entities/user/model/getFullName'
import { selectCurrentUser } from '@/features/auth/model/selectors'
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation'
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector'

const isActiveLink = ({ isActive }: { isActive: boolean }): string => {
  return isActive ? 'layout__nav-link layout__nav-link_active' : 'layout__nav-link'
}

export const AppLayout = () => {
  const { t } = useAppTranslation()
  const currentUser = useAppSelector(selectCurrentUser)

  return (
    <div className="layout">
      <aside className="layout__sidebar">
        <div className="layout__brand">
          <h1>{t('app.title')}</h1>
          <p>{t('app.subtitle')}</p>
        </div>

        <nav className="layout__navigation" aria-label="main navigation">
          <NavLink className={isActiveLink} to="/">
            {t('nav.dashboard')}
          </NavLink>
          <NavLink className={isActiveLink} to="/products">
            {t('nav.products')}
          </NavLink>
          <NavLink className={isActiveLink} to="/profile">
            {t('nav.profile')}
          </NavLink>
          <NavLink className={isActiveLink} to="/settings">
            {t('nav.settings')}
          </NavLink>
          <NavLink className={isActiveLink} to="/logout">
            {t('nav.logout')}
          </NavLink>
        </nav>
      </aside>

      <div className="layout__content-wrapper">
        <header className="layout__header">
          <div>
            <h2>{t('app.title')}</h2>
          </div>
          <p className="layout__user">
            {currentUser ? getFullName(currentUser) : t('states.loading')}
          </p>
        </header>

        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
