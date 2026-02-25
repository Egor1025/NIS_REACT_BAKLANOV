import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { TFunction } from 'i18next'

type ApiError = FetchBaseQueryError | SerializedError | undefined

const isFetchBaseQueryError = (error: ApiError): error is FetchBaseQueryError => {
  return Boolean(error && typeof error === 'object' && 'status' in error)
}

const hasMessage = (data: unknown): data is { message: string } => {
  return Boolean(data && typeof data === 'object' && 'message' in data && typeof data.message === 'string')
}

export const getApiErrorMessage = (t: TFunction<'common'>, error: ApiError): string => {
  if (!error) {
    return t('errors.generic')
  }

  if (isFetchBaseQueryError(error)) {
    if (typeof error.status === 'number') {
      if (error.status === 401 || error.status === 403) {
        return t('errors.unauthorized')
      }

      if (error.status === 404) {
        return t('errors.notFound')
      }

      if (error.status >= 500) {
        return t('errors.server')
      }
    }

    if (error.status === 'FETCH_ERROR') {
      return t('errors.network')
    }

    if (hasMessage(error.data)) {
      return error.data.message
    }
  }

  if ('message' in error && typeof error.message === 'string') {
    return error.message
  }

  return t('errors.generic')
}
