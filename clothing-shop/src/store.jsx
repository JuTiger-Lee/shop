import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { getProduct, unitPrice } from './data/products'

const MAX_QTY = 10
const CART_KEY = 'shop.cart.v1'
const WISH_KEY = 'shop.wishlist.v1'

function load(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* 저장소 사용 불가 시 메모리 상태로만 동작 */
  }
}

const ShopContext = createContext(null)

export const lineKey = (l) => `${l.productId}|${l.color}|${l.size}`

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(() => load(CART_KEY, []))
  const [wishlist, setWishlist] = useState(() => load(WISH_KEY, []))
  const [toast, setToast] = useState('')

  useEffect(() => save(CART_KEY, cart), [cart])
  useEffect(() => save(WISH_KEY, wishlist), [wishlist])
  useEffect(() => {
    if (!toast) return undefined
    const t = setTimeout(() => setToast(''), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const addToCart = useCallback((productId, color, size, qty) => {
    setCart((prev) => {
      const key = `${productId}|${color}|${size}`
      const found = prev.find((l) => lineKey(l) === key)
      if (found) {
        return prev.map((l) =>
          lineKey(l) === key ? { ...l, qty: Math.min(MAX_QTY, l.qty + qty) } : l,
        )
      }
      return [...prev, { productId, color, size, qty: Math.min(MAX_QTY, qty) }]
    })
    setToast('장바구니에 담았습니다')
  }, [])

  const setQty = useCallback((key, qty) => {
    const q = Math.max(1, Math.min(MAX_QTY, qty))
    setCart((prev) => prev.map((l) => (lineKey(l) === key ? { ...l, qty: q } : l)))
  }, [])

  const removeLine = useCallback((key) => {
    setCart((prev) => prev.filter((l) => lineKey(l) !== key))
  }, [])

  const clearCart = useCallback(() => setCart([]), [])

  const toggleWish = useCallback((productId) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId],
    )
  }, [])

  const value = useMemo(() => {
    const lines = cart
      .map((l) => ({ ...l, product: getProduct(l.productId) }))
      .filter((l) => l.product)
    const count = lines.reduce((n, l) => n + l.qty, 0)
    const total = lines.reduce((sum, l) => sum + unitPrice(l.product) * l.qty, 0)
    return { lines, count, total, wishlist, addToCart, setQty, removeLine, clearCart, toggleWish, toast }
  }, [cart, wishlist, toast, addToCart, setQty, removeLine, clearCart, toggleWish])

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>
}

export const useShop = () => useContext(ShopContext)
export { MAX_QTY }
