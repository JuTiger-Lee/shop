// 사이트 기준 URL(canonical·sitemap·OG에 사용).
// 우선순위: SITE_URL(직접 지정) > Vercel 프로덕션 도메인(빌드 시 자동 주입) > 로컬
export function resolveSiteUrl(env = process.env) {
  const raw =
    env.SITE_URL ||
    env.VITE_SITE_URL ||
    (env.VERCEL_PROJECT_PRODUCTION_URL && `https://${env.VERCEL_PROJECT_PRODUCTION_URL}`) ||
    'http://localhost:4173'
  return raw.replace(/\/+$/, '')
}
