import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { readFromStorage, storageKeys } from '@/shared/config/storage'
import type { AppLanguage, AppTheme, SettingsState } from '@/features/settings/model/types'

const defaultSettings: SettingsState = {
  language: 'ru',
  theme: 'light',
  catalogPageSize: 10,
}

export const availablePageSizes = [5, 10, 20, 30] as const

const isLanguage = (value: unknown): value is AppLanguage => {
  return value === 'ru' || value === 'en'
}

const isTheme = (value: unknown): value is AppTheme => {
  return value === 'light' || value === 'dark'
}

const isPageSize = (value: unknown): value is number => {
  return typeof value === 'number' && availablePageSizes.includes(value as (typeof availablePageSizes)[number])
}

const getInitialState = (): SettingsState => {
  const stored = readFromStorage<Partial<SettingsState>>(storageKeys.settings)

  if (!stored) {
    return defaultSettings
  }

  return {
    language: isLanguage(stored.language) ? stored.language : defaultSettings.language,
    theme: isTheme(stored.theme) ? stored.theme : defaultSettings.theme,
    catalogPageSize: isPageSize(stored.catalogPageSize)
      ? stored.catalogPageSize
      : defaultSettings.catalogPageSize,
  }
}

const settingsSlice = createSlice({
  name: 'settings',
  initialState: getInitialState(),
  reducers: {
    setLanguage: (state, action: PayloadAction<AppLanguage>) => {
      state.language = action.payload
    },
    setTheme: (state, action: PayloadAction<AppTheme>) => {
      state.theme = action.payload
    },
    setCatalogPageSize: (state, action: PayloadAction<number>) => {
      state.catalogPageSize = action.payload
    },
  },
})

export const { setLanguage, setTheme, setCatalogPageSize } = settingsSlice.actions

export const settingsReducer = settingsSlice.reducer
