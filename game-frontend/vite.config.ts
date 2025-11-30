import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://ballon-game-backend-production-cef7.up.railway.app/api',
        changeOrigin: true,
      }
    }
  }
})
