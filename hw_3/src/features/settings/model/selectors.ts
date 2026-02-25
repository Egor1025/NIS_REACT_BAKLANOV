import type { SettingsState } from '@/features/settings/model/types'

interface SettingsSliceSchema {
  settings: SettingsState
}

export const selectSettings = (state: unknown): SettingsState => {
  return (state as SettingsSliceSchema).settings
}

export const selectLanguage = (state: unknown): SettingsState['language'] => {
  return selectSettings(state).language
}

export const selectTheme = (state: unknown): SettingsState['theme'] => {
  return selectSettings(state).theme
}

export const selectCatalogPageSize = (state: unknown): number => {
  return selectSettings(state).catalogPageSize
}
