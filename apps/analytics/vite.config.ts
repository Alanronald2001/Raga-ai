import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@raga/shared-types': path.resolve(__dirname, '../../packages/shared-types/src'),
      '@raga/shared-ui': path.resolve(__dirname, '../../packages/shared-ui/src'),
      '@raga/mock-api': path.resolve(__dirname, '../../packages/mock-api/src'),
    },
  },
  server: {
    port: 5175,
  },
})
