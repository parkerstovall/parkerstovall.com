import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'

const fullReloadAlways = {
  handleHotUpdate({ server }) {
    server.ws.send({ type: 'full-reload' })
    return []
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      autoCodeSplitting: true,
      routeFileIgnorePattern: '.*[.]test[.].*',
    }),
    viteReact(),
    fullReloadAlways,
  ],
  optimizeDeps: {
    include: ['phaser'],
  },
  test: {
    environment: 'jsdom',
  },
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 1500,
  },
})
