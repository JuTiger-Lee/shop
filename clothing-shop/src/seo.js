// 라우트별 메타데이터/구조화 데이터. 브라우저(useSeo)와 빌드 스크립트(scripts/prerender.mjs)가 함께 사용하므로
// window/document 같은 브라우저 API를 쓰지 않는다.
import { CATEGORIES, PRODUCTS, getProduct, isColorSoldOut, unitPrice } from './data/products.js'
import { formatPrice } from './utils/format.js'

export const SITE_NAME = 'MONO'
export const SITE_TAGLINE = '군더더기 없는 데일리 캐주얼 웨어'
export const DEFAULT_DESCRIPTION =
  'MONO는 티셔츠·셔츠·후디·팬츠·자켓·코트·액세서리까지 미니멀한 무채색 데일리 캐주얼 의류를 판매하는 온라인 스토어입니다.'

// 검색 결과에 노출할 필요가 없는 개인화/결제 화면
const NOINDEX_PATHS = ['/cart', '/wishlist', '/checkout', '/checkout/success', '/checkout/fail']

const trimSlash = (s) => s.replace(/\/+$/, '')
export const absoluteUrl = (siteUrl, path) => `${trimSlash(siteUrl)}${path === '/' ? '/' : path}`

const isInStock = (p) => p.colors.some((c) => !isColorSoldOut(p, c))

function organizationLd(siteUrl) {
  return {
    '@type': 'Organization',
    '@id': `${trimSlash(siteUrl)}/#organization`,
    name: SITE_NAME,
    url: absoluteUrl(siteUrl, '/'),
    description: DEFAULT_DESCRIPTION,
  }
}

function websiteLd(siteUrl) {
  return {
    '@type': 'WebSite',
    '@id': `${trimSlash(siteUrl)}/#website`,
    name: SITE_NAME,
    url: absoluteUrl(siteUrl, '/'),
    inLanguage: 'ko-KR',
    publisher: { '@id': `${trimSlash(siteUrl)}/#organization` },
  }
}

function breadcrumbLd(siteUrl, items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: absoluteUrl(siteUrl, it.path),
    })),
  }
}

function productLd(siteUrl, p) {
  const url = absoluteUrl(siteUrl, `/products/${p.id}`)
  return {
    '@type': 'Product',
    '@id': `${url}#product`,
    name: p.name,
    description: p.description,
    sku: `MONO-${String(p.id).padStart(3, '0')}`,
    category: p.category,
    brand: { '@type': 'Brand', name: SITE_NAME },
    color: p.colors.join(', '),
    size: p.sizes.join(', '),
    url,
    offers: {
      '@type': 'Offer',
      url,
      priceCurrency: 'KRW',
      price: unitPrice(p),
      availability: isInStock(p) ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      itemCondition: 'https://schema.org/NewCondition',
      seller: { '@id': `${trimSlash(siteUrl)}/#organization` },
    },
  }
}

function itemListLd(siteUrl, products) {
  return {
    '@type': 'ItemList',
    numberOfItems: products.length,
    itemListElement: products.map((p, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      url: absoluteUrl(siteUrl, `/products/${p.id}`),
      name: p.name,
    })),
  }
}

const graph = (...nodes) => ({ '@context': 'https://schema.org', '@graph': nodes })

/**
 * @param {string} pathname  예: '/products/3'
 * @param {string} search    예: '?category=상의' (없으면 '')
 * @param {string} siteUrl   예: 'https://mono-shop.vercel.app'
 */
export function getRouteMeta(pathname, search, siteUrl) {
  const path = pathname !== '/' ? trimSlash(pathname) : '/'
  const base = { siteName: SITE_NAME, type: 'website', noindex: false, path }

  if (path === '/') {
    return {
      ...base,
      title: `${SITE_NAME} — ${SITE_TAGLINE}`,
      description: DEFAULT_DESCRIPTION,
      jsonLd: graph(organizationLd(siteUrl), websiteLd(siteUrl)),
    }
  }

  if (path === '/products') {
    const category = new URLSearchParams(search).get('category')
    if (category && CATEGORIES.includes(category)) {
      const list = PRODUCTS.filter((p) => p.category === category)
      // 쿼리스트링 필터 페이지는 정적 HTML이 /products 와 같으므로 canonical 을 /products 로 통일한다.
      const canonicalPath = `/products?category=${encodeURIComponent(category)}`
      return {
        ...base,
        path: '/products',
        title: `${category} | ${SITE_NAME}`,
        description: `MONO ${category} ${list.length}종: ${list.map((p) => p.name).join(', ')}.`,
        jsonLd: graph(
          breadcrumbLd(siteUrl, [
            { name: '홈', path: '/' },
            { name: '전체 상품', path: '/products' },
            { name: category, path: canonicalPath },
          ]),
          itemListLd(siteUrl, list),
        ),
      }
    }
    return {
      ...base,
      title: `전체 상품 | ${SITE_NAME}`,
      description: `MONO 전체 상품 ${PRODUCTS.length}종. ${CATEGORIES.join('·')} 카테고리의 데일리 캐주얼 의류를 신상순·가격순으로 둘러보세요.`,
      jsonLd: graph(
        breadcrumbLd(siteUrl, [
          { name: '홈', path: '/' },
          { name: '전체 상품', path: '/products' },
        ]),
        itemListLd(siteUrl, PRODUCTS),
      ),
    }
  }

  const m = path.match(/^\/products\/(\d+)$/)
  if (m) {
    const p = getProduct(m[1])
    if (p) {
      const price = p.salePrice
        ? `${formatPrice(p.salePrice)} (정가 ${formatPrice(p.price)})`
        : formatPrice(p.price)
      return {
        ...base,
        type: 'product',
        title: `${p.name} | ${SITE_NAME}`,
        description: `${p.description} 가격 ${price} · 컬러 ${p.colors.join('/')} · 사이즈 ${p.sizes.join('/')}.`,
        jsonLd: graph(
          productLd(siteUrl, p),
          breadcrumbLd(siteUrl, [
            { name: '홈', path: '/' },
            { name: p.category, path: `/products?category=${encodeURIComponent(p.category)}` },
            { name: p.name, path: `/products/${p.id}` },
          ]),
        ),
      }
    }
  }

  const titles = {
    '/cart': '장바구니',
    '/wishlist': '위시리스트',
    '/checkout': '주문서',
    '/checkout/success': '결제 완료',
    '/checkout/fail': '결제 실패',
  }
  if (NOINDEX_PATHS.includes(path)) {
    return { ...base, noindex: true, title: `${titles[path]} | ${SITE_NAME}`, description: DEFAULT_DESCRIPTION, jsonLd: null }
  }

  return { ...base, noindex: true, title: `페이지를 찾을 수 없습니다 | ${SITE_NAME}`, description: DEFAULT_DESCRIPTION, jsonLd: null }
}

// 사이트맵/프리렌더 대상 (색인 가능한 정적 경로)
export const INDEXABLE_PATHS = ['/', '/products', ...PRODUCTS.map((p) => `/products/${p.id}`)]
export const PRERENDER_PATHS = [...INDEXABLE_PATHS, ...NOINDEX_PATHS]
