import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { readFromStorage, storageKeys } from '@/shared/config/storage'

interface AuthSchema {
  auth?: {
    accessToken: string | null
  }
}

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://dummyjson.com',
  prepareHeaders: (headers, { getState }) => {
    const state = getState() as AuthSchema
    const stateToken = state.auth?.accessToken
    const persistedToken = readFromStorage<string>(storageKeys.token)
    const token = stateToken ?? (typeof persistedToken === 'string' ? persistedToken : null)

    if (token) {
      headers.set('Authorization', `Bearer ${token}`)
    }

    return headers
  },
})

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Auth', 'Product'],
  endpoints: () => ({}),
})
