import { Link } from 'react-router-dom'
import { routes } from '@/shared/config/routes'
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation'
import { Button } from '@/shared/ui/button/Button'
import { Card } from '@/shared/ui/card/Card'
import { Input } from '@/shared/ui/input/Input'

const RegisterPage = () => {
  const { t } = useAppTranslation()

  return (
    <div className="auth-page">
      <Card className="auth-card">
        <header className="auth-card__header">
          <h1>{t('register.title')}</h1>
          <p>{t('register.description')}</p>
        </header>

        <form className="auth-card__form" onSubmit={(event) => event.preventDefault()}>
          <Input label={t('common.fullName')} name="fullName" disabled placeholder="John Doe" />
          <Input label={t('common.email')} name="email" type="email" disabled placeholder="john@example.com" />
          <Input label={t('common.password')} name="password" type="password" disabled placeholder="******" />

          <Button type="submit" fullWidth disabled>
            {t('register.submit')}
          </Button>
        </form>

        <Link className="auth-page__back-link" to={routes.login}>
          {t('register.backToLogin')}
        </Link>
      </Card>
    </div>
  )
}

export default RegisterPage
