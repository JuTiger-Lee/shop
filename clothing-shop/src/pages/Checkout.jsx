import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ANONYMOUS, loadTossPayments } from '@tosspayments/tosspayments-sdk'
import GarmentImage from '../components/GarmentImage'
import { unitPrice } from '../data/products'
import { useShop } from '../store'
import { formatPrice } from '../utils/format'
import { makeOrderId, savePendingOrder } from '../utils/order'

// 토스페이먼츠 공식 문서에 공개된 "결제위젯" 테스트 클라이언트 키 (실제 결제 없음).
// 본인 키를 쓰려면 .env 의 VITE_TOSS_CLIENT_KEY 에 결제위젯 연동 키의 클라이언트 키를 넣으세요.
const DOCS_TEST_WIDGET_KEY = 'test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm'
const CLIENT_KEY = import.meta.env.VITE_TOSS_CLIENT_KEY || DOCS_TEST_WIDGET_KEY

const inputCls = 'w-full border border-neutral-300 px-3 py-3 text-sm'

export default function Checkout() {
  const { lines, count, total } = useShop()
  const [form, setForm] = useState({ name: '', phone: '', zip: '', address: '', detail: '' })
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)
  const [payError, setPayError] = useState('')
  const [widgets, setWidgets] = useState(null)
  const [ready, setReady] = useState(false)
  const rendered = useRef(null)
  const hasItems = lines.length > 0

  // 결제위젯 초기화 (비회원 결제)
  useEffect(() => {
    if (!hasItems) return undefined
    let cancelled = false
    loadTossPayments(CLIENT_KEY)
      .then((toss) => {
        if (!cancelled) setWidgets(toss.widgets({ customerKey: ANONYMOUS }))
      })
      .catch((err) => {
        if (!cancelled) setPayError(err?.message || '결제 모듈을 불러오지 못했습니다.')
      })
    return () => {
      cancelled = true
    }
  }, [hasItems])

  // 결제수단/약관 UI 렌더링 (금액 설정이 렌더링보다 선행되어야 함)
  useEffect(() => {
    if (!widgets || !hasItems || rendered.current === widgets) return
    rendered.current = widgets
    ;(async () => {
      try {
        await widgets.setAmount({ currency: 'KRW', value: total })
        await Promise.all([
          widgets.renderPaymentMethods({ selector: '#payment-method', variantKey: 'DEFAULT' }),
          widgets.renderAgreement({ selector: '#agreement', variantKey: 'AGREEMENT' }),
        ])
        setReady(true)
      } catch (err) {
        setPayError(err?.message || '결제 UI를 그리지 못했습니다.')
      }
    })()
  }, [widgets, hasItems, total])

  if (!hasItems) {
    return (
      <div className="px-4 py-24 text-center">
        <h1 className="text-2xl font-bold">주문서</h1>
        <p className="mt-6 text-neutral-500">주문할 상품이 없습니다.</p>
        <Link to="/products" className="mt-6 inline-block bg-black px-8 py-3 text-sm font-semibold text-white">
          쇼핑하러 가기
        </Link>
      </div>
    )
  }

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = '받는 사람을 입력해 주세요.'
    if (!/^01\d{8,9}$/.test(form.phone.replace(/-/g, ''))) e.phone = '휴대폰 번호를 정확히 입력해 주세요. (예: 01012345678)'
    if (!form.address.trim()) e.address = '주소를 입력해 주세요.'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const pay = async (ev) => {
    ev.preventDefault()
    setPayError('')
    if (!validate()) return
    if (!widgets || !ready) {
      setPayError('결제 UI를 불러오는 중입니다. 잠시 후 다시 시도해 주세요.')
      return
    }

    const orderId = makeOrderId()
    const orderName =
      lines.length === 1 ? lines[0].product.name : `${lines[0].product.name} 외 ${lines.length - 1}건`
    const phone = form.phone.replace(/-/g, '')

    savePendingOrder({
      orderId,
      orderName,
      amount: total,
      shipping: { ...form, phone },
      items: lines.map((l) => ({
        productId: l.productId,
        name: l.product.name,
        color: l.color,
        size: l.size,
        qty: l.qty,
        price: unitPrice(l.product),
      })),
    })

    setBusy(true)
    try {
      await widgets.requestPayment({
        orderId,
        orderName,
        customerName: form.name.trim(),
        customerMobilePhone: phone,
        successUrl: `${window.location.origin}/checkout/success`,
        failUrl: `${window.location.origin}/checkout/fail`,
      })
    } catch (err) {
      // 사용자가 결제창을 닫은 경우 등 (리다이렉트 전 오류)
      setPayError(err?.message || '결제 요청 중 오류가 발생했습니다.')
      setBusy(false)
    }
  }

  const field = (id, label, props = {}) => (
    <div>
      <label htmlFor={id} className="mb-1 block text-sm font-semibold">{label}</label>
      <input
        id={id}
        value={form[id]}
        onChange={set(id)}
        aria-invalid={Boolean(errors[id])}
        aria-describedby={errors[id] ? `${id}-err` : undefined}
        className={inputCls}
        {...props}
      />
      {errors[id] && <p id={`${id}-err`} role="alert" className="mt-1 text-xs text-red-600">{errors[id]}</p>}
    </div>
  )

  return (
    <div className="mx-auto max-w-4xl px-4 py-8">
      <h1 className="text-2xl font-bold">주문서</h1>
      <form onSubmit={pay} noValidate className="mt-6 grid gap-8 md:grid-cols-[1fr_340px]">
        <section className="space-y-4" aria-labelledby="ship-h">
          <h2 id="ship-h" className="text-lg font-semibold">배송 정보</h2>
          {field('name', '받는 사람', { autoComplete: 'name' })}
          {field('phone', '휴대폰 번호', { type: 'tel', inputMode: 'numeric', placeholder: '01012345678', autoComplete: 'tel' })}
          {field('zip', '우편번호 (선택)', { autoComplete: 'postal-code' })}
          {field('address', '주소', { autoComplete: 'street-address' })}
          {field('detail', '상세 주소 (선택)')}

          <h2 className="pt-4 text-lg font-semibold">결제 수단</h2>
          {!ready && !payError && <p className="text-sm text-neutral-500">결제 UI를 불러오는 중…</p>}
          <div id="payment-method" />
          <div id="agreement" />
        </section>

        <aside className="h-fit space-y-4 bg-neutral-50 p-5" aria-labelledby="sum-h">
          <h2 id="sum-h" className="text-lg font-semibold">주문 상품 ({count})</h2>
          <ul className="space-y-3">
            {lines.map((l) => (
              <li key={`${l.productId}|${l.color}|${l.size}`} className="flex gap-3 text-sm">
                <div className="h-16 w-14 shrink-0 overflow-hidden bg-neutral-100">
                  <GarmentImage type={l.product.type} color={l.color} alt="" />
                </div>
                <div className="flex-1">
                  <p>{l.product.name}</p>
                  <p className="text-xs text-neutral-500">{l.color} / {l.size} · {l.qty}개</p>
                </div>
                <p className="font-medium">{formatPrice(unitPrice(l.product) * l.qty)}</p>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t border-neutral-200 pt-4 font-bold">
            <span>결제 금액</span>
            <span>{formatPrice(total)}</span>
          </div>
          {payError && <p role="alert" className="text-sm text-red-600">{payError}</p>}
          <button
            type="submit"
            disabled={busy || !ready}
            className="w-full bg-black py-4 text-sm font-semibold text-white hover:bg-neutral-800 disabled:bg-neutral-400"
          >
            {busy ? '결제창 여는 중…' : `${formatPrice(total)} 결제하기`}
          </button>
          <p className="text-xs text-neutral-500">토스페이먼츠 테스트 모드입니다. 실제 결제는 이루어지지 않습니다.</p>
        </aside>
      </form>
    </div>
  )
}
