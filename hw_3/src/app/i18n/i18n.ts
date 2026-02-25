import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import type { AppLanguage } from '@/features/settings/model/types'
import { readFromStorage, storageKeys } from '@/shared/config/storage'
import enTranslations from '@/app/i18n/locales/en/common.json'
import ruTranslations from '@/app/i18n/locales/ru/common.json'

interface SettingsSchema {
  language?: AppLanguage
}

const getInitialLanguage = (): AppLanguage => {
  const persistedSettings = readFromStorage<SettingsSchema>(storageKeys.settings)

  if (persistedSettings?.language === 'en') {
    return 'en'
  }

  return 'ru'
}

void i18n.use(initReactI18next).init({
  resources: {
    en: {
      common: enTranslations,
    },
    ru: {
      common: ruTranslations,
    },
  },
  lng: getInitialLanguage(),
  fallbackLng: 'ru',
  defaultNS: 'common',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
