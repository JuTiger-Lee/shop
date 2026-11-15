import { useEffect, useRef } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useShop } from '../store'
import { formatPrice } from '../utils/format'
import { clearPendingOrder, loadPendingOrder } from '../utils/order'

export default function CheckoutSuccess() {
  const [params] = useSearchParams()
  const { clearCart } = useShop()
  const orderId = params.get('orderId')
  const amount = Number(params.get('amount'))
  const paymentKey = params.get('paymentKey')

  // StrictMode 재실행에도 pending 주문을 한 번만 읽도록 ref에 보관
  const pending = useRef(undefined)
  if (pending.current === undefined) pending.current = loadPendingOrder()
  const order = pending.current

  const valid = Boolean(paymentKey && orderId && order && order.orderId === orderId && order.amount === amount)

  useEffect(() => {
    if (valid) {
      clearCart()
      clearPendingOrder()
    }
  }, [valid, clearCart])

  if (!valid) {
    return (
      <div className="px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">주문 정보를 확인할 수 없습니다</h1>
        <p className="mt-4 text-neutral-500">
          결제 정보가 주문과 일치하지 않거나 이미 처리된 주문입니다.
        </p>
        <Link to="/cart" className="mt-6 inline-block underline">장바구니로 돌아가기</Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-2xl font-bold">결제 인증이 완료되었습니다</h1>
      <p className="mt-3 rounded bg-amber-50 p-3 text-sm text-amber-900">
        이 데모는 서버 승인(confirm) 단계를 생략합니다. 토스페이먼츠에서 결제 인증까지만 진행되며 결제가 최종 승인되지는 않습니다.
      </p>

      <dl className="mt-6 grid grid-cols-[100px_1fr] gap-y-2 text-sm">
        <dt className="text-neutral-500">주문번호</dt><dd className="break-all">{order.orderId}</dd>
        <dt className="text-neutral-500">결제 금액</dt><dd className="font-semibold">{formatPrice(order.amount)}</dd>
        <dt className="text-neutral-500">받는 사람</dt><dd>{order.shipping.name} · {order.shipping.phone}</dd>
        <dt className="text-neutral-500">배송지</dt>
        <dd>{[order.shipping.zip, order.shipping.address, order.shipping.detail].filter(Boolean).join(' ')}</dd>
      </dl>

      <h2 className="mt-8 text-lg font-semibold">주문 상품</h2>
      <ul className="mt-3 divide-y divide-neutral-200 border-y border-neutral-200">
        {order.items.map((it) => (
          <li key={`${it.productId}|${it.color}|${it.size}`} className="flex justify-between py-3 text-sm">
            <span>{it.name} <span className="text-neutral-500">({it.color} / {it.size}) × {it.qty}</span></span>
            <span>{formatPrice(it.price * it.qty)}</span>
          </li>
        ))}
      </ul>

      <Link to="/" className="mt-8 inline-block bg-black px-8 py-3 text-sm font-semibold text-white">
        홈으로
      </Link>
    </div>
  )
}
