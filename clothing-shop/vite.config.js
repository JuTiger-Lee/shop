import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolveSiteUrl } from './scripts/site-url.mjs'

export default defineConfig(({ mode }) => {
  const env = { ...process.env, ...loadEnv(mode, process.cwd(), '') }
  return {
    plugins: [react(), tailwindcss()],
    define: {
      'import.meta.env.VITE_SITE_URL': JSON.stringify(resolveSiteUrl(env)),
    },
  }
})
