import { useMemo } from 'react'
import { availablePageSizes, setCatalogPageSize, setLanguage, setTheme } from '@/features/settings/model/settingsSlice'
import { selectCatalogPageSize, selectLanguage, selectTheme } from '@/features/settings/model/selectors'
import type { AppLanguage, AppTheme } from '@/features/settings/model/types'
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation'
import { useAppDispatch } from '@/shared/lib/hooks/useAppDispatch'
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector'
import { Card } from '@/shared/ui/card/Card'
import { Select } from '@/shared/ui/select/Select'

export const SettingsForm = () => {
  const { t } = useAppTranslation()
  const dispatch = useAppDispatch()

  const language = useAppSelector(selectLanguage)
  const theme = useAppSelector(selectTheme)
  const pageSize = useAppSelector(selectCatalogPageSize)

  const languageOptions = useMemo(
    () => [
      { value: 'ru' as const, label: t('settings.languageOptions.ru') },
      { value: 'en' as const, label: t('settings.languageOptions.en') },
    ],
    [t],
  )

  const themeOptions = useMemo(
    () => [
      { value: 'light' as const, label: t('settings.themeOptions.light') },
      { value: 'dark' as const, label: t('settings.themeOptions.dark') },
    ],
    [t],
  )

  const pageSizeOptions = useMemo(
    () => availablePageSizes.map((size) => ({ value: size, label: String(size) })),
    [],
  )

  return (
    <Card className="settings-card">
      <h1>{t('settings.title')}</h1>

      <div className="settings-card__controls">
        <Select<AppLanguage>
          label={t('settings.language')}
          options={languageOptions}
          value={language}
          onChange={(nextLanguage) => {
            dispatch(setLanguage(nextLanguage))
          }}
        />

        <Select<AppTheme>
          label={t('settings.theme')}
          options={themeOptions}
          value={theme}
          onChange={(nextTheme) => {
            dispatch(setTheme(nextTheme))
          }}
        />

        <Select<number>
          label={t('settings.pageSize')}
          options={pageSizeOptions}
          value={pageSize}
          onChange={(nextSize) => {
            dispatch(setCatalogPageSize(nextSize))
          }}
        />
      </div>

      <p className="settings-card__hint">{t('settings.savedHint')}</p>
    </Card>
  )
}
