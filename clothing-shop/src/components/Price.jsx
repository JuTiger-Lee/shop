import { discountRate } from '../data/products'
import { formatPrice } from '../utils/format'

export default function Price({ product, large = false }) {
  const rate = discountRate(product)
  const size = large ? 'text-xl' : 'text-sm'
  if (!rate) return <p className={`${size} font-semibold`}>{formatPrice(product.price)}</p>
  return (
    <p className={`${size} flex flex-wrap items-baseline gap-x-2`}>
      <span className="font-semibold text-red-600">{rate}%</span>
      <span className="font-semibold">{formatPrice(product.salePrice)}</span>
      <span className="text-xs text-neutral-400 line-through">{formatPrice(product.price)}</span>
    </p>
  )
}
