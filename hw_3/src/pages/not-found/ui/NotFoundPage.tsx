import { Link } from 'react-router-dom'
import { routes } from '@/shared/config/routes'
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation'
import { Button } from '@/shared/ui/button/Button'
import { Card } from '@/shared/ui/card/Card'

const NotFoundPage = () => {
  const { t } = useAppTranslation()

  return (
    <section className="centered-page">
      <Card className="not-found-card">
        <h1>404</h1>
        <h2>{t('notFound.title')}</h2>
        <p>{t('notFound.description')}</p>
        <Link to={routes.dashboard}>
          <Button>{t('notFound.goHome')}</Button>
        </Link>
      </Card>
    </section>
  )
}

export default NotFoundPage
