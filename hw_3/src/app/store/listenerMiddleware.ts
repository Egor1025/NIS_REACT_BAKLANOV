import { createListenerMiddleware, isAnyOf } from '@reduxjs/toolkit'
import { baseApi } from '@/shared/api/baseApi'
import { removeFromStorage, storageKeys, writeToStorage } from '@/shared/config/storage'
import { logout, setCredentials } from '@/features/auth/model/authSlice'
import type { AuthState } from '@/features/auth/model/types'
import {
  setCatalogPageSize,
  setLanguage,
  setTheme,
} from '@/features/settings/model/settingsSlice'
import type { SettingsState } from '@/features/settings/model/types'

interface PersistState {
  auth: AuthState
  settings: SettingsState
}

export const listenerMiddleware = createListenerMiddleware()

listenerMiddleware.startListening({
  matcher: isAnyOf(setLanguage, setTheme, setCatalogPageSize),
  effect: (_, listenerApi) => {
    const state = listenerApi.getState() as PersistState
    writeToStorage(storageKeys.settings, state.settings)
  },
})

listenerMiddleware.startListening({
  matcher: isAnyOf(setCredentials, logout),
  effect: (_, listenerApi) => {
    const state = listenerApi.getState() as PersistState

    if (state.auth.accessToken) {
      writeToStorage(storageKeys.token, state.auth.accessToken)
      return
    }

    removeFromStorage(storageKeys.token)
  },
})

listenerMiddleware.startListening({
  actionCreator: logout,
  effect: (_, listenerApi) => {
    listenerApi.dispatch(baseApi.util.resetApiState())
  },
})
