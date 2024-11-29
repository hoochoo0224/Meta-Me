import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
// import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()
    // VitePWA({
    //   workbox: {
    //     maximumFileSizeToCacheInBytes: 3 * 1024 * 1024, // 3MB로 제한 증가
    //   },
    //   registerType: 'autoUpdate',
    //   devOptions: {enabled: true},
    //   includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
    //   manifest: {
    //     name: 'Meta Me',
    //     short_name: 'Meta Me',
    //     theme_color: '#ffffff',
    //     lang: 'ko',
    //     icons: [
    //         {
    //             src: 'pwa-64x64.png',
    //             sizes: '64x64',
    //             type: 'image/png'
    //         },
    //         {
    //             src: 'pwa-192x192.png',
    //             sizes: '192x192',
    //             type: 'image/png'
    //         },
    //         {
    //             src: 'pwa-512x512.png',
    //             sizes: '512x512',
    //             type: 'image/png',
    //             purpose: 'any'
    //         },
    //         {
    //             src: 'maskable-icon-512x512.png',
    //             sizes: '512x512',
    //             type: 'image/png',
    //             purpose: 'maskable'
    //         }
    //     ],
    //   }, 
    // })
  
  ],

  base: '/',
  // base: '/Meta-Me/React/',
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@assets': fileURLToPath(new URL('./src/assets', import.meta.url)),
      '@components': fileURLToPath(new URL('./src/components', import.meta.url)),
      '@pages': fileURLToPath(new URL('./src/pages', import.meta.url)),
      '@recoil': fileURLToPath(new URL('./src/recoil', import.meta.url)),
      '@types': fileURLToPath(new URL('./src/types', import.meta.url)),
      '@apis': fileURLToPath(new URL('./src/apis', import.meta.url)),
    },
  },
  // SCSS 전역 사용
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: '@import "@assets/styles/main.scss";',
      },
    },
  },
  server: {
    port: 8000,
    host: '0.0.0.0',
  }
})