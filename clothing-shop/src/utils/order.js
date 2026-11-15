const KEY = 'shop.pendingOrder.v1'

export function makeOrderId() {
  const rand = Math.random().toString(36).slice(2, 8)
  return `ORD-${Date.now()}-${rand}`
}

// 결제창으로 이동하기 전 주문 정보를 임시 저장 (성공 화면에서 금액 대조·표시에 사용)
export function savePendingOrder(order) {
  try {
    sessionStorage.setItem(KEY, JSON.stringify(order))
  } catch {
    /* sessionStorage 사용 불가 시 성공 화면에서 주문 상세는 생략 */
  }
}

export function loadPendingOrder() {
  try {
    const raw = sessionStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function clearPendingOrder() {
  try {
    sessionStorage.removeItem(KEY)
  } catch {
    /* noop */
  }
}
