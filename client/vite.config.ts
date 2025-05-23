import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // API Proxy
  server: {
    proxy: {
      '/api': 'http://localhost:3234'
    }
  }
})