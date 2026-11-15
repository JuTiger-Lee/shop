import { Link } from 'react-router-dom'
import GarmentImage from '../components/GarmentImage'
import { unitPrice } from '../data/products'
import { MAX_QTY, lineKey, useShop } from '../store'
import { formatPrice } from '../utils/format'

export default function Cart() {
  const { lines, count, total, setQty, removeLine } = useShop()

  if (lines.length === 0) {
    return (
      <div className="px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">장바구니</h1>
        <p className="mt-6 text-neutral-500">장바구니가 비어 있습니다.</p>
        <Link to="/products" className="mt-6 inline-block bg-black px-8 py-3 text-sm font-semibold text-white">
          쇼핑 계속하기
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="text-2xl font-bold">장바구니 <span className="text-base font-normal text-neutral-500">({count})</span></h1>
      <ul className="mt-6 divide-y divide-neutral-200 border-y border-neutral-200">
        {lines.map((l) => {
          const key = lineKey(l)
          const p = l.product
          return (
            <li key={key} className="flex gap-4 py-5">
              <Link to={`/products/${p.id}`} className="h-28 w-24 shrink-0 overflow-hidden bg-neutral-100">
                <GarmentImage type={p.type} color={l.color} alt={`${p.name} ${l.color}`} />
              </Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-2">
                  <div>
                    <Link to={`/products/${p.id}`} className="text-sm font-medium hover:underline">{p.name}</Link>
                    <p className="mt-1 text-xs text-neutral-500">{l.color} / {l.size}</p>
                  </div>
                  <button type="button" onClick={() => removeLine(key)} aria-label={`${p.name} ${l.color} ${l.size} 삭제`} className="h-6 text-sm text-neutral-400 hover:text-black">
                    ✕
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center border border-neutral-300">
                    <button type="button" aria-label="수량 감소" disabled={l.qty <= 1} onClick={() => setQty(key, l.qty - 1)} className="h-8 w-8 disabled:text-neutral-300">−</button>
                    <span className="w-8 text-center text-sm">{l.qty}</span>
                    <button type="button" aria-label="수량 증가" disabled={l.qty >= MAX_QTY} onClick={() => setQty(key, l.qty + 1)} className="h-8 w-8 disabled:text-neutral-300">+</button>
                  </div>
                  <p className="text-sm font-semibold">{formatPrice(unitPrice(p) * l.qty)}</p>
                </div>
              </div>
            </li>
          )
        })}
      </ul>
      <div className="mt-6 flex items-center justify-between text-lg font-bold">
        <span>상품 금액 합계</span>
        <span>{formatPrice(total)}</span>
      </div>
      <Link to="/checkout" className="mt-6 block bg-black py-4 text-center text-sm font-semibold text-white hover:bg-neutral-800">
        주문하기
      </Link>
      <p className="mt-3 text-center text-xs text-neutral-500">토스페이먼츠 테스트 모드 · 실제 결제는 이루어지지 않습니다.</p>
    </div>
  )
}
