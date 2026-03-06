import { Link } from 'react-router-dom'
import { getFullName } from '@/entities/user/model/getFullName'
import { selectCurrentUser } from '@/features/auth/model/selectors'
import { selectTheme } from '@/features/settings/model/selectors'
import { routes } from '@/shared/config/routes'
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation'
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector'
import { Button } from '@/shared/ui/button/Button'
import { Card } from '@/shared/ui/card/Card'

const DashboardPage = () => {
  const { t } = useAppTranslation()
  const currentUser = useAppSelector(selectCurrentUser)
  const currentTheme = useAppSelector(selectTheme)

  return (
    <section className="page dashboard-page">
      <header className="page__header">
        <h1>{t('dashboard.title')}</h1>
        <p>{t('dashboard.greeting', { name: currentUser ? getFullName(currentUser) : 'User' })}</p>
      </header>

      <p className="page__description">{t('dashboard.description')}</p>

      <div className="dashboard-page__metrics">
        <Card>
          <h3>{t('dashboard.cards.api')}</h3>
          <p>DummyJSON</p>
        </Card>
        <Card>
          <h3>{t('dashboard.cards.auth')}</h3>
          <p>{currentUser ? t('common.login') : t('common.logout')}</p>
        </Card>
        <Card>
          <h3>{t('dashboard.cards.settings')}</h3>
          <p>{currentTheme}</p>
        </Card>
      </div>

      <Link to={routes.products}>
        <Button>{t('dashboard.goProducts')}</Button>
      </Link>
    </section>
  )
}

export default DashboardPage
