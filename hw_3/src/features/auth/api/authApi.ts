import { baseApi } from '@/shared/api/baseApi'
import type { User } from '@/entities/user/model/types'
import type { LoginRequest, LoginResponse } from '@/features/auth/model/types'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: {
          ...credentials,
          expiresInMins: 60,
        },
      }),
      invalidatesTags: ['Auth'],
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => ({
        url: '/auth/me',
      }),
      providesTags: ['Auth'],
    }),
  }),
})

export const { useLoginMutation, useGetCurrentUserQuery } = authApi
