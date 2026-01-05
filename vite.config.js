import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1500, // Increase from default 500kb to 1500kb
    rollupOptions: {
      output: {
        manualChunks: {
          'primereact': ['primereact'],
          'leaflet': ['leaflet', 'react-leaflet'],
          'lightgallery': ['lightgallery', 'lg-thumbnail', 'lg-zoom'],
        }
      }
    }
  },
})
