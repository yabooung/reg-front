import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@api': path.resolve(__dirname, './src/api'),
      '@context': path.resolve(__dirname, './src/context'),
      '@hooks': path.resolve(__dirname, './src/hooks'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@services': path.resolve(__dirname, './src/services'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
})
