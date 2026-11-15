import { Link, useSearchParams } from 'react-router-dom'

export default function CheckoutFail() {
  const [params] = useSearchParams()
  const code = params.get('code')
  const message = params.get('message')

  return (
    <div className="px-4 py-24 text-center">
      <h1 className="text-2xl font-bold">결제에 실패했습니다</h1>
      <p className="mt-4 text-neutral-600">{message || '결제가 취소되었거나 오류가 발생했습니다.'}</p>
      {code && <p className="mt-1 text-xs text-neutral-400">오류 코드: {code}</p>}
      <div className="mt-8 flex justify-center gap-4 text-sm">
        <Link to="/checkout" className="bg-black px-8 py-3 font-semibold text-white">주문서로 돌아가기</Link>
        <Link to="/cart" className="border border-neutral-300 px-8 py-3">장바구니</Link>
      </div>
    </div>
  )
}
