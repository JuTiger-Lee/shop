// 사이트 기준 URL(canonical·sitemap·robots·llms.txt·OG에 사용).
// 도메인이 바뀌면 PRODUCTION_URL 을 고치고 `npm run seo:files` 로 public/ 파일을 다시 생성하세요.
// 일회성으로 바꾸려면 SITE_URL 환경변수로 덮어쓸 수 있습니다.
export const PRODUCTION_URL = 'https://shop-henna-delta.vercel.app'

export function resolveSiteUrl(env = process.env) {
  return (env.SITE_URL || env.VITE_SITE_URL || PRODUCTION_URL).replace(/\/+$/, '')
}
