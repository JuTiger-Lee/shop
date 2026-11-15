import { Link } from 'react-router-dom'
import { useShop } from '../store'

export default function Toast() {
  const { toast } = useShop()
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center px-4">
      {toast && (
        <div className="pointer-events-auto flex items-center gap-4 rounded bg-black px-4 py-3 text-sm text-white shadow-lg">
          <span>{toast}</span>
          <Link to="/cart" className="underline">보러가기</Link>
        </div>
      )}
    </div>
  )
}
