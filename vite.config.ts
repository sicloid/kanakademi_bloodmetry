import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    allowedHosts: ["ee6a-188-132-232-104.ngrok-free.app"]
  }
})
