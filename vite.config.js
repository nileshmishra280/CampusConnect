import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
// https://vite.dev/config/
export default defineConfig({
  host:true,
  allowedHosts: ['campusconnect-71g3.onrender.com'],
  plugins: [react(),tailwindcss()],
})
