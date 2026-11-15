import { Link } from 'react-router-dom'
import GarmentImage from '../components/GarmentImage'
import ProductCard from '../components/ProductCard'
import { CATEGORIES, PRODUCTS } from '../data/products'

const NEW = PRODUCTS.filter((p) => p.isNew).slice(0, 8)
const BEST = PRODUCTS.filter((p) => p.isBest).slice(0, 8)
const CATEGORY_PREVIEW = {
  상의: { type: 'hoodie', color: '그레이' },
  하의: { type: 'pants', color: '베이지' },
  아우터: { type: 'jacket', color: '카키' },
  액세서리: { type: 'cap', color: '블랙' },
}

function Section({ title, to, products }) {
  return (
    <section className="mx-auto max-w-6xl px-4 pt-16" aria-labelledby={`h-${title}`}>
      <div className="mb-6 flex items-end justify-between">
        <h2 id={`h-${title}`} className="text-xl font-bold">{title}</h2>
        <Link to={to} className="text-sm text-neutral-500 hover:underline">전체보기</Link>
      </div>
      <ul className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4">
        {products.map((p) => <ProductCard key={p.id} product={p} />)}
      </ul>
    </section>
  )
}

export default function Home() {
  return (
    <>
      <section className="bg-neutral-900 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-6 px-4 py-12 md:grid-cols-2 md:py-20">
          <div>
            <p className="text-xs tracking-[0.3em] text-neutral-400">NEW SEASON</p>
            <h1 className="mt-3 text-3xl font-black leading-tight md:text-5xl">
              군더더기 없는<br />데일리 웨어
            </h1>
            <p className="mt-4 text-sm text-neutral-300">
              매일 손이 가는 기본 아이템. 오래 입을수록 좋은 옷을 만듭니다.
            </p>
            <Link
              to="/products"
              className="mt-8 inline-block bg-white px-8 py-3 text-sm font-semibold text-black hover:bg-neutral-200"
            >
              전체 상품 보기
            </Link>
          </div>
          <div className="mx-auto aspect-[4/5] w-full max-w-sm overflow-hidden">
            <GarmentImage type="coat" color="브라운" alt="MONO 시즌 대표 롱 코트" />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pt-12" aria-label="카테고리 바로가기">
        <ul className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {CATEGORIES.map((c) => (
            <li key={c}>
              <Link
                to={`/products?category=${encodeURIComponent(c)}`}
                className="group relative block aspect-[4/3] overflow-hidden bg-neutral-100"
              >
                <GarmentImage
                  {...CATEGORY_PREVIEW[c]}
                  alt=""
                  className="transition-transform duration-500 group-hover:scale-105"
                />
                <span className="absolute bottom-3 left-3 bg-white px-3 py-1 text-sm font-semibold">{c}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Section title="신상품" to="/products?sort=new" products={NEW} />
      <Section title="베스트" to="/products" products={BEST} />
    </>
  )
}
