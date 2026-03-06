import { Link } from 'react-router-dom'
import { getFullName } from '@/entities/user/model/getFullName'
import { useGetCurrentUserQuery } from '@/features/auth/api/authApi'
import { selectAccessToken, selectCurrentUser } from '@/features/auth/model/selectors'
import { routes } from '@/shared/config/routes'
import { getApiErrorMessage } from '@/shared/lib/error/getApiErrorMessage'
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation'
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector'
import { Button } from '@/shared/ui/button/Button'
import { Card } from '@/shared/ui/card/Card'
import { ErrorState } from '@/shared/ui/error-state/ErrorState'
import { Loader } from '@/shared/ui/loader/Loader'

const ProfilePage = () => {
  const { t } = useAppTranslation()
  const accessToken = useAppSelector(selectAccessToken)
  const localUser = useAppSelector(selectCurrentUser)

  const { data, isLoading, isError, error, refetch } = useGetCurrentUserQuery(undefined, {
    skip: !accessToken || Boolean(localUser),
  })

  const currentUser = localUser ?? data

  if (isLoading) {
    return <Loader centered />
  }

  if (isError && !currentUser) {
    return (
      <ErrorState
        message={getApiErrorMessage(t, error)}
        retryLabel={t('states.retry')}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (!currentUser) {
    return <ErrorState message={t('errors.notFound')} />
  }

  return (
    <section className="page">
      <header className="page__header">
        <h1>{t('profile.title')}</h1>
      </header>

      <Card className="profile-card">
        <img className="profile-card__image" src={currentUser.image} alt={currentUser.username} />
        <dl className="profile-card__meta">
          <div>
            <dt>{t('common.name')}</dt>
            <dd>{getFullName(currentUser)}</dd>
          </div>
          <div>
            <dt>{t('common.email')}</dt>
            <dd>{currentUser.email}</dd>
          </div>
          <div>
            <dt>{t('common.username')}</dt>
            <dd>{currentUser.username}</dd>
          </div>
        </dl>

        <Link to={routes.logout}>
          <Button variant="danger">{t('profile.logout')}</Button>
        </Link>
      </Card>
    </section>
  )
}

export default ProfilePage
