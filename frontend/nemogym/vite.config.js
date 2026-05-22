import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,

    allowedHosts: [
      'b53e-152-170-28-108.ngrok-free.app',
      '.ngrok-free.app' 
    ],
    proxy: {
      '/mercadopago': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})