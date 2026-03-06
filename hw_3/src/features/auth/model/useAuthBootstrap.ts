import { useEffect, useMemo } from 'react'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import { useGetCurrentUserQuery } from '@/features/auth/api/authApi'
import { logout, setUser } from '@/features/auth/model/authSlice'
import { selectAccessToken } from '@/features/auth/model/selectors'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch'
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector'

const isUnauthorizedError = (error: unknown): boolean => {
  if (!error || typeof error !== 'object' || !('status' in error)) {
    return false
  }

  const queryError = error as FetchBaseQueryError

  return queryError.status === 401 || queryError.status === 403
}

export const useAuthBootstrap = () => {
  const dispatch = useAppDispatch()
  const accessToken = useAppSelector(selectAccessToken)
  const shouldFetchUser = Boolean(accessToken)

  const { data, error, isLoading, isFetching } = useGetCurrentUserQuery(undefined, {
    skip: !shouldFetchUser,
  })

  useEffect(() => {
    if (!data) {
      return
    }

    dispatch(setUser(data))
  }, [data, dispatch])

  useEffect(() => {
    if (!isUnauthorizedError(error)) {
      return
    }

    dispatch(logout())
  }, [dispatch, error])

  const isInitializing = useMemo(() => {
    return shouldFetchUser && (isLoading || isFetching)
  }, [isFetching, isLoading, shouldFetchUser])

  return {
    isInitializing,
  }
}
