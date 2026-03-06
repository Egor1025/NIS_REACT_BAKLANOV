import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { User } from '@/entities/user/model/types'
import { useLoginMutation } from '@/features/auth/api/authApi'
import { setCredentials } from '@/features/auth/model/authSlice'
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation'
import { getApiErrorMessage } from '@/shared/lib/error/getApiErrorMessage'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch'
import { Button } from '@/shared/ui/button/Button'
import { Card } from '@/shared/ui/card/Card'
import { Input } from '@/shared/ui/input/Input'

interface FormState {
  username: string
  password: string
}

interface FormErrors {
  username?: string
  password?: string
}

const getUserFromResponse = (payload: {
  id: number
  username: string
  firstName: string
  lastName: string
  email: string
  image?: string
}): User => {
  return {
    id: payload.id,
    username: payload.username,
    firstName: payload.firstName,
    lastName: payload.lastName,
    email: payload.email,
    image: payload.image,
  }
}

const isUnauthorizedStatus = (error: unknown): boolean => {
  if (!error || typeof error !== 'object' || !('status' in error)) {
    return false
  }

  const queryError = error as FetchBaseQueryError

  return queryError.status === 400 || queryError.status === 401
}

export const LoginForm = () => {
  const { t } = useAppTranslation()
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [login, { isLoading }] = useLoginMutation()

  const [formState, setFormState] = useState<FormState>({
    username: '',
    password: '',
  })
  const [formErrors, setFormErrors] = useState<FormErrors>({})
  const [requestError, setRequestError] = useState<string | null>(null)

  const validate = (): FormErrors => {
    const nextErrors: FormErrors = {}

    if (!formState.username.trim()) {
      nextErrors.username = t('auth.validation.usernameRequired')
    }

    if (!formState.password.trim()) {
      nextErrors.password = t('auth.validation.passwordRequired')
    } else if (formState.password.trim().length < 4) {
      nextErrors.password = t('auth.validation.passwordMin')
    }

    return nextErrors
  }

  const isFormValid = useMemo(() => {
    return formState.username.trim().length > 0 && formState.password.trim().length >= 4
  }, [formState.password, formState.username])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const validationErrors = validate()

    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors)
      return
    }

    setFormErrors({})
    setRequestError(null)

    try {
      const response = await login({
        username: formState.username.trim(),
        password: formState.password,
      }).unwrap()

      const accessToken = response.accessToken ?? response.token

      if (!accessToken) {
        setRequestError(t('errors.generic'))
        return
      }

      dispatch(
        setCredentials({
          accessToken,
          user: getUserFromResponse(response),
        }),
      )

      navigate('/', { replace: true })
    } catch (error) {
      if (isUnauthorizedStatus(error)) {
        setRequestError(t('errors.invalidCredentials'))
        return
      }

      setRequestError(getApiErrorMessage(t, error as FetchBaseQueryError))
    }
  }

  return (
    <Card className="auth-card">
      <header className="auth-card__header">
        <h1>{t('auth.title')}</h1>
        <p>{t('auth.subtitle')}</p>
      </header>

      <form className="auth-card__form" onSubmit={handleSubmit} noValidate>
        <Input
          name="username"
          label={t('auth.username')}
          value={formState.username}
          autoComplete="username"
          onChange={(event) => {
            setFormState((previousState) => ({
              ...previousState,
              username: event.target.value,
            }))
          }}
          error={formErrors.username}
        />

        <Input
          name="password"
          type="password"
          label={t('auth.password')}
          value={formState.password}
          autoComplete="current-password"
          onChange={(event) => {
            setFormState((previousState) => ({
              ...previousState,
              password: event.target.value,
            }))
          }}
          error={formErrors.password}
        />

        {requestError ? <p className="auth-card__error">{requestError}</p> : null}

        <Button type="submit" fullWidth disabled={!isFormValid || isLoading}>
          {isLoading ? t('states.loading') : t('auth.submit')}
        </Button>
      </form>

      <footer className="auth-card__footer">
        <p>{t('auth.demoHint')}</p>
      </footer>
    </Card>
  )
}
