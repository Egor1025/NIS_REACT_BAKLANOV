import { useEffect } from 'react'
import i18n from '@/app/i18n/i18n'
import { selectLanguage, selectTheme } from '@/features/settings/model/selectors'
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector'

export const useApplySettings = () => {
  const language = useAppSelector(selectLanguage)
  const theme = useAppSelector(selectTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    void i18n.changeLanguage(language)
  }, [language])
}
