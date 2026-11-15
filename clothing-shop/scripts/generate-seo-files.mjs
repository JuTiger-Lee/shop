// public/ 에 sitemap.xml · robots.txt · llms.txt 를 생성한다 (커밋되는 고정 파일).
// 상품 데이터나 도메인이 바뀌면 `npm run seo:files` 로 다시 생성 후 커밋.
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { resolveSiteUrl } from './site-url.mjs'
import { CATEGORIES, PRODUCTS } from '../src/data/products.js'
import { formatPrice } from '../src/utils/format.js'
import { DEFAULT_DESCRIPTION, INDEXABLE_PATHS, SITE_NAME, absoluteUrl } from '../src/seo.js'

const publicDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'public')
const SITE_URL = resolveSiteUrl()

function write(relPath, content) {
  const file = join(publicDir, relPath)
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, content)
}

const today = new Date().toISOString().slice(0, 10)
write(
  'sitemap.xml',
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${INDEXABLE_PATHS.map((p) => `  <url><loc>${absoluteUrl(SITE_URL, p)}</loc><lastmod>${today}</lastmod></url>`).join('\n')}
</urlset>
`,
)

const AI_BOTS = [
  'GPTBot', 'OAI-SearchBot', 'ChatGPT-User',
  'ClaudeBot', 'Claude-SearchBot', 'Claude-User',
  'PerplexityBot', 'Perplexity-User',
  'Google-Extended', 'Applebot-Extended', 'CCBot',
]
write(
  'robots.txt',
  `# 검색엔진·AI 검색 크롤러 모두 허용 (장바구니·결제 화면은 페이지 내 noindex 처리)
User-agent: *
Allow: /

# AI 검색/답변 엔진 (GEO)
${AI_BOTS.map((b) => `User-agent: ${b}`).join('\n')}
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`,
)

write(
  'llms.txt',
  `# ${SITE_NAME}

> ${DEFAULT_DESCRIPTION}

${SITE_NAME}는 성별 구분 없는 단일 브랜드 캐주얼 의류 온라인 스토어입니다. 카테고리는 ${CATEGORIES.join(', ')}이며, 가격은 원화(KRW) 기준입니다.
이 사이트는 학습·포트폴리오용 데모이며, 결제는 토스페이먼츠 테스트 모드로만 동작합니다(실제 주문·배송 없음).

## 주요 페이지

- [홈](${absoluteUrl(SITE_URL, '/')}): 신상품·베스트 상품
- [전체 상품](${absoluteUrl(SITE_URL, '/products')}): 카테고리·사이즈·컬러 필터, 신상순·가격순 정렬

${CATEGORIES.map(
  (c) => `## ${c}

${PRODUCTS.filter((p) => p.category === c)
  .map(
    (p) =>
      `- [${p.name}](${absoluteUrl(SITE_URL, `/products/${p.id}`)}): ${
        p.salePrice ? `${formatPrice(p.salePrice)} (정가 ${formatPrice(p.price)})` : formatPrice(p.price)
      } · 컬러 ${p.colors.join('/')} · 사이즈 ${p.sizes.join('/')} — ${p.description}`,
  )
  .join('\n')}`,
).join('\n\n')}
`,
)


console.log(`seo:files: sitemap.xml(${INDEXABLE_PATHS.length} urls), robots.txt, llms.txt → public/ (${SITE_URL})`)
