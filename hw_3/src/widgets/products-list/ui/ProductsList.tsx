import { memo } from 'react'
import { Link } from 'react-router-dom'
import type { Product } from '@/entities/product/model/types'
import { useAppTranslation } from '@/shared/lib/i18n/useAppTranslation'
import { Card } from '@/shared/ui/card/Card'

interface ProductCardProps {
  product: Product
}

const ProductCardComponent = ({ product }: ProductCardProps) => {
  const { t } = useAppTranslation()

  return (
    <Card className="product-card">
      <img className="product-card__image" src={product.thumbnail} alt={product.title} loading="lazy" />
      <div className="product-card__body">
        <h3>{product.title}</h3>
        <p>{product.description}</p>
      </div>
      <dl className="product-card__meta">
        <div>
          <dt>{t('common.price')}</dt>
          <dd>${product.price}</dd>
        </div>
        <div>
          <dt>{t('common.rating')}</dt>
          <dd>{product.rating}</dd>
        </div>
        <div>
          <dt>{t('common.category')}</dt>
          <dd>{product.category}</dd>
        </div>
      </dl>
      <Link className="product-card__link" to={`/products/${product.id}`}>
        {t('common.open')}
      </Link>
    </Card>
  )
}

const ProductCard = memo(ProductCardComponent)

interface ProductsListProps {
  products: Product[]
}

export const ProductsList = ({ products }: ProductsListProps) => {
  return (
    <section className="products-grid">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </section>
  )
}
