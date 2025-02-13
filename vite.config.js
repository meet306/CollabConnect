import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // Needed for proper WebSocket connection
  },
  resolve: {
    alias: {
      // Needed for Monaco Editor
      'monaco-editor': '@monaco-editor/react',
    },
  },
  optimizeDeps: {
    exclude: ['@monaco-editor/react'],
  },
})