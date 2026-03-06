import { Link } from 'react-router-dom'
import { LoginForm } from '@/features/auth/ui/LoginForm'
import { routes } from '@/shared/config/routes'
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation'

const LoginPage = () => {
  const { t } = useAppTranslation()

  return (
    <div className="auth-page">
      <LoginForm />
      <p className="auth-page__switch-link">
        {t('auth.noAccount')} <Link to={routes.register}>{t('auth.createAccount')}</Link>
      </p>
    </div>
  )
}

export default LoginPage
