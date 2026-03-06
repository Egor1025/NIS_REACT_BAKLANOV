import type { SerializedError } from '@reduxjs/toolkit'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import type { TFunction } from 'i18next'

type ApiError = FetchBaseQueryError | SerializedError | undefined

const isFetchBaseQueryError = (error: ApiError): error is FetchBaseQueryError => {
  return Boolean(error && typeof error === 'object' && 'status' in error)
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
  }

  return t('errors.generic')
}
