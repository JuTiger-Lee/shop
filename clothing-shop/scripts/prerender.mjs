// vite build 이후 실행: 라우트별 정적 HTML 생성 (sitemap·robots·llms.txt 는 public/ 고정 파일, generate-seo-files.mjs).
// JS를 실행하지 않는 크롤러(대부분의 AI 검색 봇, 일부 SNS 미리보기 봇)도
// 페이지별 제목·설명·본문·구조화 데이터를 읽을 수 있게 한다.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolveSiteUrl } from './site-url.mjs'
import { CATEGORIES, PRODUCTS, getProduct, isOptionSoldOut } from '../src/data/products.js'
import { formatPrice } from '../src/utils/format.js'
import { DEFAULT_DESCRIPTION, PRERENDER_PATHS, SITE_NAME, SITE_TAGLINE, absoluteUrl, getRouteMeta } from '../src/seo.js'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const dist = join(root, 'dist')
if (existsSync(join(root, '.env'))) process.loadEnvFile(join(root, '.env'))

const SITE_URL = resolveSiteUrl()
const template = readFileSync(join(dist, 'index.html'), 'utf8')

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
// </script> 조기 종료 방지
const safeJson = (obj) => JSON.stringify(obj).replace(/</g, '\\u003c')

const priceText = (p) =>
  p.salePrice ? `${formatPrice(p.salePrice)} <s>${formatPrice(p.price)}</s>` : formatPrice(p.price)

const productItem = (p) =>
  `<li><a href="/products/${p.id}">${esc(p.name)}</a> · ${esc(p.category)} · ${priceText(p)}</li>`

const nav = `<header><a href="/">${SITE_NAME}</a><nav aria-label="카테고리"><ul>${['전체 상품', ...CATEGORIES]
  .map((c, i) => `<li><a href="/products${i ? `?category=${encodeURIComponent(c)}` : ''}">${esc(c)}</a></li>`)
  .join('')}</ul></nav></header>`
const footer = `<footer><p>${SITE_NAME} — ${SITE_TAGLINE}.</p><p>이 사이트는 학습·포트폴리오용 데모이며, 결제는 토스페이먼츠 테스트 모드로만 동작합니다.</p></footer>`

function body(path, meta) {
  if (path === '/') {
    const list = (title, items) => `<section><h2>${title}</h2><ul>${items.map(productItem).join('')}</ul></section>`
    return `<h1>${SITE_NAME} — ${SITE_TAGLINE}</h1><p>${esc(DEFAULT_DESCRIPTION)}</p>${list(
      '신상품',
      PRODUCTS.filter((p) => p.isNew).slice(0, 8),
    )}${list('베스트', PRODUCTS.filter((p) => p.isBest).slice(0, 8))}`
  }
  if (path === '/products') {
    return `<h1>전체 상품</h1><p>${esc(meta.description)}</p>${CATEGORIES.map(
      (c) => `<section><h2>${esc(c)}</h2><ul>${PRODUCTS.filter((p) => p.category === c).map(productItem).join('')}</ul></section>`,
    ).join('')}`
  }
  const m = path.match(/^\/products\/(\d+)$/)
  if (m) {
    const p = getProduct(m[1])
    const soldOut = p.colors.flatMap((c) => p.sizes.filter((s) => isOptionSoldOut(p, c, s)).map((s) => `${c} ${s}`))
    return `<nav aria-label="breadcrumb"><a href="/">홈</a> / <a href="/products?category=${encodeURIComponent(p.category)}">${esc(
      p.category,
    )}</a></nav><article><h1>${esc(p.name)}</h1><p>카테고리: ${esc(p.category)}</p><p>가격: ${priceText(p)}</p><p>${esc(
      p.description,
    )}</p><dl><dt>컬러</dt><dd>${esc(p.colors.join(', '))}</dd><dt>사이즈</dt><dd>${esc(p.sizes.join(', '))}</dd>${
      soldOut.length ? `<dt>품절 옵션</dt><dd>${esc(soldOut.join(', '))}</dd>` : ''
    }</dl></article>`
  }
  return `<h1>${esc(meta.title.split(' | ')[0])}</h1>`
}

function headTags(meta) {
  const url = absoluteUrl(SITE_URL, meta.path)
  const tags = [
    `<meta name="robots" content="${meta.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large'}" />`,
    !meta.noindex && `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="${meta.type}" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta name="twitter:title" content="${esc(meta.title)}" />`,
    `<meta name="twitter:description" content="${esc(meta.description)}" />`,
    process.env.GOOGLE_SITE_VERIFICATION &&
      `<meta name="google-site-verification" content="${esc(process.env.GOOGLE_SITE_VERIFICATION)}" />`,
    process.env.NAVER_SITE_VERIFICATION &&
      `<meta name="naver-site-verification" content="${esc(process.env.NAVER_SITE_VERIFICATION)}" />`,
    `<link rel="alternate" type="text/plain" title="llms.txt" href="/llms.txt" />`,
    meta.jsonLd && `<script type="application/ld+json" id="ld-json">${safeJson(meta.jsonLd)}</script>`,
  ]
  return tags.filter(Boolean).join('\n    ')
}

function render(meta, rootHtml) {
  return template
    .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(meta.title)}</title>`)
    .replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${esc(meta.description)}" />`)
    .replace(/\s*<\/head>/, `\n    ${headTags(meta)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${rootHtml}</div>`)
}

function write(relPath, content) {
  const file = join(dist, relPath)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, content)
}

// '/' → index.html, '/products/1' → products/1.html (vercel.json cleanUrls 로 확장자 없이 서빙)
for (const path of PRERENDER_PATHS) {
  const meta = getRouteMeta(path, '', SITE_URL)
  write(path === '/' ? 'index.html' : `${path.slice(1)}.html`, render(meta, `${nav}<main>${body(path, meta)}</main>${footer}`))
}
// 존재하지 않는 경로: Vercel 이 404 상태코드로 이 파일을 서빙
const notFound = getRouteMeta('/__404', '', SITE_URL)
write('404.html', render(notFound, ''))

console.log(`prerender: ${PRERENDER_PATHS.length + 1} pages → ${SITE_URL}`)
