import { Input } from '@/shared/ui/input/Input'
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation'

interface CatalogSearchProps {
  value: string
  onChange: (nextValue: string) => void
}

export const CatalogSearch = ({ value, onChange }: CatalogSearchProps) => {
  const { t } = useAppTranslation()

  return (
    <Input
      name="search"
      label={t('products.searchLabel')}
      placeholder={t('products.searchPlaceholder')}
      value={value}
      onChange={(event) => {
        onChange(event.target.value)
      }}
    />
  )
}
