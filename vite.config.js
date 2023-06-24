import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
  module: {
    rules: [
      {
       test: /\.svg$/,
       loader: 'vue-svg-loader', // `vue-svg` for webpack 1.x
      },
    ],
  },
  plugins: [
    vue(),
    vueJsx(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@pub': fileURLToPath(new URL('./public', import.meta.url))
    }
  }
})
