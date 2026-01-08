import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon/FamilyMart.png', 'Gmaps.png', 'waze.svg', 'QRcodewoi.png'],
      manifest: false, // Use existing manifest.json
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          },
          {
            urlPattern: /^https:\/\/unpkg\.com\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'unpkg-cache',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 7 // 1 week
              }
            }
          }
        ]
      },
      devOptions: {
        enabled: true,
        type: 'module'
      }
    })
  ],
  publicDir: 'public',
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      external: ['chart.js/auto', 'quill'], // Mark chart.js and quill as external
      output: {
        manualChunks: {
          'primereact': ['primereact'],
          'leaflet': ['leaflet', 'react-leaflet'],
          'lightgallery': ['lightgallery', 'lg-thumbnail', 'lg-zoom'],
        }
      }
    },
    // Ensure icon folder is copied to dist
    copyPublicDir: true
  },
  // Ensure icon folder is accessible
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.svg']
})
