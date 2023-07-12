import { fileURLToPath, URL } from 'node:url'
export default defineNuxtConfig({
  devtools: { enabled: true },
  alias: {
    '@': fileURLToPath(new URL('./src', import.meta.url)),
    '@pub': fileURLToPath(new URL('./public', import.meta.url)),
    '@assets': fileURLToPath(new URL('./assets', import.meta.url)),
  },
  modules: [
    // ...
    '@pinia/nuxt',
  ],
})