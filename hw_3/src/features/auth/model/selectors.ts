import type { AuthState } from '@/features/auth/model/types'

interface AuthSliceSchema {
  auth: AuthState
}

export const selectAuth = (state: unknown): AuthState => {
  return (state as AuthSliceSchema).auth
}

export const selectAccessToken = (state: unknown): string | null => {
  return selectAuth(state).accessToken
}

export const selectCurrentUser = (state: unknown): AuthState['user'] => {
  return selectAuth(state).user
}

export const selectIsAuthenticated = (state: unknown): boolean => {
  return Boolean(selectAccessToken(state))
}
