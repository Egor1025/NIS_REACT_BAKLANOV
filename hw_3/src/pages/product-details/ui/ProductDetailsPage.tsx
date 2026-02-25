import { Link, useParams } from 'react-router-dom'
import { useGetProductByIdQuery } from '@/entities/product/api/productApi'
import { routes } from '@/shared/config/routes'
import { getApiErrorMessage } from '@/shared/lib/error/getApiErrorMessage'
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation'
import { Button } from '@/shared/ui/button/Button'
import { Card } from '@/shared/ui/card/Card'
import { ErrorState } from '@/shared/ui/error-state/ErrorState'
import { Loader } from '@/shared/ui/loader/Loader'

const ProductDetailsPage = () => {
  const { t } = useAppTranslation()
  const { id } = useParams<{ id: string }>()

  const productId = Number.parseInt(id ?? '', 10)
  const isValidId = Number.isFinite(productId)

  const { data, isLoading, isError, error, refetch } = useGetProductByIdQuery(productId, {
    skip: !isValidId,
  })

  if (!isValidId) {
    return <ErrorState message={t('errors.notFound')} />
  }

  if (isLoading) {
    return <Loader centered />
  }

  if (isError) {
    return (
      <ErrorState
        message={getApiErrorMessage(t, error)}
        retryLabel={t('states.retry')}
        onRetry={() => {
          void refetch()
        }}
      />
    )
  }

  if (!data) {
    return <ErrorState message={t('errors.notFound')} />
  }

  return (
    <section className="page">
      <header className="page__header">
        <h1>{t('products.details')}</h1>
        <Link to={routes.products}>
          <Button variant="secondary">{t('products.backToList')}</Button>
        </Link>
      </header>

      <Card className="product-details">
        <img className="product-details__image" src={data.thumbnail} alt={data.title} />

        <div>
          <h2>{data.title}</h2>
          <p>{data.description}</p>

          <dl className="product-details__meta">
            <div>
              <dt>{t('common.price')}</dt>
              <dd>${data.price}</dd>
            </div>
            <div>
              <dt>{t('common.rating')}</dt>
              <dd>{data.rating}</dd>
            </div>
            <div>
              <dt>{t('common.category')}</dt>
              <dd>{data.category}</dd>
            </div>
            <div>
              <dt>{t('common.stock')}</dt>
              <dd>{data.stock}</dd>
            </div>
            {data.brand ? (
              <div>
                <dt>{t('common.brand')}</dt>
                <dd>{data.brand}</dd>
              </div>
            ) : null}
          </dl>
        </div>
      </Card>
    </section>
  )
}

export default ProductDetailsPage
