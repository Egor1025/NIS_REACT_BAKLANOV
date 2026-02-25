import { useEffect, useMemo, useState } from 'react'
import { useGetProductsQuery } from '@/entities/product/api/productApi'
import { useCatalogQueryParams } from '@/features/product-catalog/model/useCatalogQueryParams'
import { CatalogSearch } from '@/features/product-catalog/ui/CatalogSearch'
import { selectCatalogPageSize } from '@/features/settings/model/selectors'
import { getApiErrorMessage } from '@/shared/lib/error/getApiErrorMessage'
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation'
import { useAppSelector } from '@/shared/lib/hooks/useAppSelector'
import { useDebouncedValue } from '@/shared/lib/hooks/useDebouncedValue'
import { EmptyState } from '@/shared/ui/empty-state/EmptyState'
import { ErrorState } from '@/shared/ui/error-state/ErrorState'
import { Loader } from '@/shared/ui/loader/Loader'
import { Pagination } from '@/shared/ui/pagination/Pagination'
import { ProductsList } from '@/widgets/products-list/ui/ProductsList'

const ProductsPage = () => {
  const { t } = useAppTranslation()
  const pageSize = useAppSelector(selectCatalogPageSize)
  const { query, page, limit, skip, setQuery, setPage } = useCatalogQueryParams(pageSize)
  const [searchValue, setSearchValue] = useState(query)
  const debouncedQuery = useDebouncedValue(searchValue, 450)

  useEffect(() => {
    setSearchValue(query)
  }, [query])

  useEffect(() => {
    if (debouncedQuery === query) {
      return
    }

    setQuery(debouncedQuery)
  }, [debouncedQuery, query, setQuery])

  const { data, isLoading, isFetching, isError, error, refetch } = useGetProductsQuery({
    limit,
    skip,
    q: query.length > 0 ? query : undefined,
  })

  const totalPages = useMemo(() => {
    if (!data) {
      return 1
    }

    return Math.max(1, Math.ceil(data.total / limit))
  }, [data, limit])

  useEffect(() => {
    if (page <= totalPages) {
      return
    }

    setPage(totalPages)
  }, [page, setPage, totalPages])

  return (
    <section className="page">
      <header className="page__header">
        <h1>{t('products.title')}</h1>
        {data ? <p>{t('products.total', { total: data.total })}</p> : null}
      </header>

      <CatalogSearch value={searchValue} onChange={setSearchValue} />

      {isLoading ? <Loader centered /> : null}

      {isError ? (
        <ErrorState
          message={getApiErrorMessage(t, error)}
          retryLabel={t('states.retry')}
          onRetry={() => {
            void refetch()
          }}
        />
      ) : null}

      {!isLoading && !isError && data && data.products.length === 0 ? <EmptyState message={t('products.empty')} /> : null}

      {!isLoading && !isError && data && data.products.length > 0 ? <ProductsList products={data.products} /> : null}

      {!isLoading && !isError ? <Pagination page={page} totalPages={totalPages} onPageChange={setPage} /> : null}

      {isFetching && !isLoading ? <p className="page__hint">{t('states.loading')}</p> : null}
      <p className="page__hint">{t('products.pageInfo', { page, totalPages })}</p>
    </section>
  )
}

export default ProductsPage
