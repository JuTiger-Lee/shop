import { Link } from 'react-router-dom'
import GarmentImage from './GarmentImage'
import Price from './Price'
import WishButton from './WishButton'

export default function ProductCard({ product }) {
  const color = product.colors[0]
  return (
    <li className="group relative">
      <Link to={`/products/${product.id}`} className="block">
        <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
          <GarmentImage
            type={product.type}
            color={color}
            alt={`${product.name} ${color}`}
            className="transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="mt-3 space-y-1">
          <p className="text-xs text-neutral-500">{product.category}</p>
          <h3 className="text-sm leading-snug">{product.name}</h3>
          <Price product={product} />
          <p className="text-xs text-neutral-400">{product.colors.length}개 컬러</p>
        </div>
      </Link>
      <WishButton productId={product.id} name={product.name} className="absolute right-2 top-2" />
    </li>
  )
}
