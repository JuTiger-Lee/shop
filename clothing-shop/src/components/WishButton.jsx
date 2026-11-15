import { useShop } from '../store'

export default function WishButton({ productId, name, className = '' }) {
  const { wishlist, toggleWish } = useShop()
  const on = wishlist.includes(productId)
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault()
        toggleWish(productId)
      }}
      aria-pressed={on}
      aria-label={`${name} 위시리스트 ${on ? '해제' : '추가'}`}
      className={`flex h-9 w-9 items-center justify-center rounded-full bg-white/90 shadow-sm hover:bg-white ${className}`}
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
        <path
          d="M12 21s-7.5-4.6-9.5-9.2C1.3 8.6 3 5.5 6.2 5.5c2 0 3.4 1.1 5.8 3.3 2.4-2.2 3.8-3.3 5.8-3.3 3.2 0 4.9 3.1 3.7 6.3C19.5 16.4 12 21 12 21z"
          fill={on ? '#111' : 'none'}
          stroke="#111"
          strokeWidth="1.8"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  )
}
