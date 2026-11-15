import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { PRODUCTS } from '../data/products'
import { useShop } from '../store'

export default function Wishlist() {
  const { wishlist } = useShop()
  const items = wishlist.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">위시리스트 <span className="text-base font-normal text-neutral-500">({items.length})</span></h1>
      {items.length === 0 ? (
        <div className="py-24 text-center text-neutral-500">
          <p>찜한 상품이 없습니다.</p>
          <Link to="/products" className="mt-6 inline-block bg-black px-8 py-3 text-sm font-semibold text-white">
            상품 둘러보기
          </Link>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4">
          {items.map((p) => <ProductCard key={p.id} product={p} />)}
        </ul>
      )}
    </div>
  )
}
