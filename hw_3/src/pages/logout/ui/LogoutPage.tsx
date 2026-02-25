import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { logout } from '@/features/auth/model/authSlice'
import { routes } from '@/shared/config/routes'
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch'
import { Card } from '@/shared/ui/card/Card'

const LogoutPage = () => {
  const { t } = useAppTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    dispatch(logout())
    navigate(routes.login, { replace: true })
  }, [dispatch, navigate])

  return (
    <section className="page">
      <Card>
        <h1>{t('logout.title')}</h1>
        <p>{t('logout.description')}</p>
      </Card>
    </section>
  )
}

export default LogoutPage
