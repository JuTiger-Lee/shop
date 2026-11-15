import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { absoluteUrl, getRouteMeta } from './seo'

const SITE_URL = import.meta.env.VITE_SITE_URL || window.location.origin

function upsert(selector, create, attr, value) {
  let el = document.head.querySelector(selector)
  if (!el) {
    el = create()
    document.head.appendChild(el)
  }
  el.setAttribute(attr, value)
}

function setMeta(key, name, content) {
  upsert(
    `meta[${key}="${name}"]`,
    () => {
      const el = document.createElement('meta')
      el.setAttribute(key, name)
      return el
    },
    'content',
    content,
  )
}

// 클라이언트 라우팅으로 페이지가 바뀔 때 head 태그를 갱신한다.
// 최초 진입 시의 태그는 빌드 시 프리렌더된 HTML에 이미 들어 있다.
export default function useSeo() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    const m = getRouteMeta(pathname, search, SITE_URL)
    const url = absoluteUrl(SITE_URL, m.path)

    document.title = m.title
    setMeta('name', 'description', m.description)
    setMeta('name', 'robots', m.noindex ? 'noindex, follow' : 'index, follow, max-image-preview:large')
    setMeta('property', 'og:title', m.title)
    setMeta('property', 'og:description', m.description)
    setMeta('property', 'og:type', m.type)
    setMeta('property', 'og:url', url)
    setMeta('name', 'twitter:title', m.title)
    setMeta('name', 'twitter:description', m.description)
    if (m.noindex) document.head.querySelector('link[rel="canonical"]')?.remove()
    else upsert('link[rel="canonical"]', () => Object.assign(document.createElement('link'), { rel: 'canonical' }), 'href', url)

    let ld = document.getElementById('ld-json')
    if (m.jsonLd) {
      if (!ld) {
        ld = Object.assign(document.createElement('script'), { id: 'ld-json', type: 'application/ld+json' })
        document.head.appendChild(ld)
      }
      ld.textContent = JSON.stringify(m.jsonLd)
    } else if (ld) {
      ld.remove()
    }
  }, [pathname, search])
}
