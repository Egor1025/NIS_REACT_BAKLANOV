import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import type { User } from '@/entities/user/model/types'
import { readFromStorage, storageKeys } from '@/shared/config/storage'
import type { AuthState } from '@/features/auth/model/types'

const savedToken = readFromStorage<string>(storageKeys.token)

const initialState: AuthState = {
  accessToken: typeof savedToken === 'string' ? savedToken : null,
  user: null,
}

interface CredentialsPayload {
  accessToken: string
  user: User
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<CredentialsPayload>) => {
      state.accessToken = action.payload.accessToken
      state.user = action.payload.user
    },
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload
    },
    logout: (state) => {
      state.accessToken = null
      state.user = null
    },
  },
})

export const { setCredentials, setUser, logout } = authSlice.actions

export const authReducer = authSlice.reducer
