// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // escucha en todas las interfaces de red (0.0.0.0)
    host: true,
    // acepta cualquier host externo
    allowedHosts: true
  }
})
