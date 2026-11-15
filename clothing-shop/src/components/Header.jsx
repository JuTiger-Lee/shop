import { Link, NavLink } from 'react-router-dom'
import { CATEGORIES } from '../data/products'
import { useShop } from '../store'

const Badge = ({ n }) =>
  n > 0 ? (
    <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-black px-1.5 text-[11px] leading-5 text-white">
      {n}
    </span>
  ) : null

export default function Header() {
  const { count, wishlist } = useShop()
  return (
    <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <Link to="/" className="text-xl font-black tracking-[0.2em]" aria-label="MONO 홈">
          MONO
        </Link>
        <nav aria-label="카테고리" className="hidden gap-6 text-sm md:flex">
          {CATEGORIES.map((c) => (
            <NavLink key={c} to={`/products?category=${encodeURIComponent(c)}`} className="hover:underline">
              {c}
            </NavLink>
          ))}
        </nav>
        <nav aria-label="바로가기" className="flex items-center gap-4 text-sm">
          <Link to="/wishlist" className="hover:underline">
            위시리스트<Badge n={wishlist.length} />
          </Link>
          <Link to="/cart" className="hover:underline">
            장바구니<Badge n={count} />
          </Link>
        </nav>
      </div>
      <nav aria-label="카테고리 (모바일)" className="flex gap-5 overflow-x-auto border-t border-neutral-100 px-4 py-2 text-sm md:hidden">
        <Link to="/products" className="shrink-0">전체</Link>
        {CATEGORIES.map((c) => (
          <Link key={c} to={`/products?category=${encodeURIComponent(c)}`} className="shrink-0">
            {c}
          </Link>
        ))}
      </nav>
    </header>
  )
}
