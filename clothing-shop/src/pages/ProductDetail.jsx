import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import GarmentImage from '../components/GarmentImage'
import Price from '../components/Price'
import WishButton from '../components/WishButton'
import { COLOR_HEX, getProduct, isColorSoldOut, isOptionSoldOut } from '../data/products'
import { MAX_QTY, useShop } from '../store'

export default function ProductDetail() {
  const { id } = useParams()
  const product = getProduct(id)
  const { addToCart } = useShop()
  const [color, setColor] = useState('')
  const [size, setSize] = useState('')
  const [qty, setQty] = useState(1)
  const [image, setImage] = useState(0)
  const [error, setError] = useState('')

  useEffect(() => {
    setColor('')
    setSize('')
    setQty(1)
    setImage(0)
    setError('')
  }, [id])

  if (!product) {
    return (
      <div className="px-4 py-24 text-center text-neutral-500">
        <p>상품을 찾을 수 없습니다.</p>
        <Link to="/products" className="mt-4 inline-block underline">전체 상품 보기</Link>
      </div>
    )
  }

  const previewColor = color || product.colors[0]

  const pickColor = (c) => {
    setColor(c)
    setError('')
    if (size && isOptionSoldOut(product, c, size)) setSize('')
  }

  const submit = () => {
    if (!color || !size) {
      setError(`${!color ? '컬러' : '사이즈'}를 선택해 주세요.`)
      return
    }
    addToCart(product.id, color, size, qty)
    setError('')
  }

  const opt = (on, disabled) =>
    `min-w-12 border px-3 py-2 text-sm ${
      disabled
        ? 'cursor-not-allowed border-neutral-200 text-neutral-300 line-through'
        : on
          ? 'border-black bg-black text-white'
          : 'border-neutral-300 hover:border-black'
    }`

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <p className="mb-4 text-sm text-neutral-500">
        <Link to="/products" className="hover:underline">전체</Link> /{' '}
        <Link to={`/products?category=${encodeURIComponent(product.category)}`} className="hover:underline">
          {product.category}
        </Link>
      </p>
      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <div className="aspect-[4/5] overflow-hidden bg-neutral-100">
            <GarmentImage
              type={product.type}
              color={previewColor}
              variant={image}
              alt={`${product.name} ${previewColor} ${image === 0 ? '정면' : '디테일'} 이미지`}
            />
          </div>
          <div className="mt-3 flex gap-3">
            {[0, 1].map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setImage(v)}
                aria-label={v === 0 ? '정면 이미지 보기' : '디테일 이미지 보기'}
                aria-pressed={image === v}
                className={`h-24 w-20 overflow-hidden border-2 ${image === v ? 'border-black' : 'border-transparent'}`}
              >
                <GarmentImage type={product.type} color={previewColor} variant={v} alt="" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm text-neutral-500">{product.category}</p>
              <h1 className="mt-1 text-2xl font-bold">{product.name}</h1>
            </div>
            <WishButton productId={product.id} name={product.name} className="border border-neutral-200" />
          </div>
          <div className="mt-4"><Price product={product} large /></div>
          <p className="mt-6 text-sm leading-relaxed text-neutral-600">{product.description}</p>

          <fieldset className="mt-8">
            <legend className="mb-2 text-sm font-semibold">컬러 {color && <span className="font-normal text-neutral-500">· {color}</span>}</legend>
            <div className="flex flex-wrap gap-2">
              {product.colors.map((c) => {
                const out = isColorSoldOut(product, c)
                return (
                  <button
                    key={c}
                    type="button"
                    disabled={out}
                    aria-pressed={color === c}
                    aria-label={`${c}${out ? ' (품절)' : ''}`}
                    onClick={() => pickColor(c)}
                    className={`flex items-center gap-2 ${opt(color === c, out)}`}
                  >
                    <span className="h-4 w-4 rounded-full border border-neutral-400" style={{ background: COLOR_HEX[c] }} aria-hidden="true" />
                    {c}
                  </button>
                )
              })}
            </div>
          </fieldset>

          <fieldset className="mt-6">
            <legend className="mb-2 text-sm font-semibold">사이즈</legend>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s) => {
                const out = color ? isOptionSoldOut(product, color, s) : false
                return (
                  <button
                    key={s}
                    type="button"
                    disabled={out}
                    aria-pressed={size === s}
                    aria-label={`${s}${out ? ' (품절)' : ''}`}
                    onClick={() => { setSize(s); setError('') }}
                    className={opt(size === s, out)}
                  >
                    {s}
                  </button>
                )
              })}
            </div>
            {color && product.sizes.some((s) => isOptionSoldOut(product, color, s)) && (
              <p className="mt-2 text-xs text-neutral-500">취소선 표시된 사이즈는 품절입니다.</p>
            )}
          </fieldset>

          <div className="mt-6 flex items-center gap-3">
            <span className="text-sm font-semibold">수량</span>
            <div className="flex items-center border border-neutral-300">
              <button type="button" aria-label="수량 감소" disabled={qty <= 1} onClick={() => setQty(qty - 1)} className="h-9 w-9 disabled:text-neutral-300">−</button>
              <span className="w-10 text-center text-sm" aria-live="polite">{qty}</span>
              <button type="button" aria-label="수량 증가" disabled={qty >= MAX_QTY} onClick={() => setQty(qty + 1)} className="h-9 w-9 disabled:text-neutral-300">+</button>
            </div>
          </div>

          {error && <p role="alert" className="mt-4 text-sm text-red-600">{error}</p>}

          <button type="button" onClick={submit} className="mt-6 w-full bg-black py-4 text-sm font-semibold text-white hover:bg-neutral-800">
            장바구니 담기
          </button>
        </div>
      </div>
    </div>
  )
}
