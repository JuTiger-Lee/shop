import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'
import { ALL_COLORS, CATEGORIES, COLOR_HEX, PRODUCTS, SIZES, unitPrice } from '../data/products'

const SORTS = [
  { value: 'new', label: '신상순' },
  { value: 'low', label: '낮은 가격순' },
  { value: 'high', label: '높은 가격순' },
]
const FILTER_SIZES = [...SIZES, 'FREE']

const chip = (on) =>
  `rounded-full border px-3 py-1 text-sm ${on ? 'border-black bg-black text-white' : 'border-neutral-300 hover:border-black'}`

export default function Products() {
  const [params, setParams] = useSearchParams()
  const category = params.get('category') ?? ''
  const sort = params.get('sort') ?? 'new'
  const sizes = params.getAll('size')
  const colors = params.getAll('color')

  const update = (mutate) => {
    const next = new URLSearchParams(params)
    mutate(next)
    setParams(next, { replace: true })
  }
  const toggleMulti = (key, value) =>
    update((n) => {
      const cur = n.getAll(key)
      n.delete(key)
      ;(cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]).forEach((v) => n.append(key, v))
    })

  const list = useMemo(() => {
    const filtered = PRODUCTS.filter(
      (p) =>
        (!category || p.category === category) &&
        (!sizes.length || sizes.some((s) => p.sizes.includes(s))) &&
        (!colors.length || colors.some((c) => p.colors.includes(c))),
    )
    const sorted = [...filtered]
    if (sort === 'low') sorted.sort((a, b) => unitPrice(a) - unitPrice(b))
    else if (sort === 'high') sorted.sort((a, b) => unitPrice(b) - unitPrice(a))
    else sorted.sort((a, b) => Number(b.isNew) - Number(a.isNew) || b.id - a.id)
    return sorted
  }, [category, sort, sizes.join(), colors.join()])

  const hasFilter = sizes.length > 0 || colors.length > 0

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-2xl font-bold">{category || '전체 상품'}</h1>

      <nav aria-label="카테고리 탭" className="mt-5 flex gap-2 overflow-x-auto">
        {['', ...CATEGORIES].map((c) => (
          <button
            key={c || 'all'}
            type="button"
            aria-pressed={category === c}
            className={`shrink-0 ${chip(category === c)}`}
            onClick={() => update((n) => (c ? n.set('category', c) : n.delete('category')))}
          >
            {c || '전체'}
          </button>
        ))}
      </nav>

      <div className="mt-6 space-y-4 border-y border-neutral-200 py-4">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-12 text-sm font-semibold">사이즈</span>
          {FILTER_SIZES.map((s) => (
            <button key={s} type="button" aria-pressed={sizes.includes(s)} className={chip(sizes.includes(s))} onClick={() => toggleMulti('size', s)}>
              {s}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-12 text-sm font-semibold">컬러</span>
          {ALL_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              aria-pressed={colors.includes(c)}
              className={`flex items-center gap-1.5 ${chip(colors.includes(c))}`}
              onClick={() => toggleMulti('color', c)}
            >
              <span className="h-3 w-3 rounded-full border border-neutral-400" style={{ background: COLOR_HEX[c] }} aria-hidden="true" />
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between text-sm">
        <p aria-live="polite">총 {list.length}개</p>
        <div className="flex items-center gap-3">
          {hasFilter && (
            <button type="button" className="text-neutral-500 underline" onClick={() => update((n) => { n.delete('size'); n.delete('color') })}>
              필터 초기화
            </button>
          )}
          <label className="flex items-center gap-2">
            <span className="sr-only">정렬</span>
            <select
              value={sort}
              onChange={(e) => update((n) => n.set('sort', e.target.value))}
              className="border border-neutral-300 px-2 py-1"
            >
              {SORTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>
        </div>
      </div>

      {list.length === 0 ? (
        <div className="py-24 text-center text-neutral-500">
          <p>조건에 맞는 상품이 없습니다.</p>
          <Link to="/products" className="mt-4 inline-block underline">전체 상품 보기</Link>
        </div>
      ) : (
        <ul className="mt-6 grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-4">
          {list.map((p) => <ProductCard key={p.id} product={p} />)}
        </ul>
      )}
    </div>
  )
}
