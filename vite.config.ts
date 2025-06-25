// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: "/DATA-COMPRESSION-PORTAL/", // 👈 this is the important line
  plugins: [react()],
})
