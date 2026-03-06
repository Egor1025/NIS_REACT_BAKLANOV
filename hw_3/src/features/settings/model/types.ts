export type AppLanguage = 'ru' | 'en'

export type AppTheme = 'light' | 'dark'

export interface SettingsState {
  language: AppLanguage
  theme: AppTheme
  catalogPageSize: number
}
