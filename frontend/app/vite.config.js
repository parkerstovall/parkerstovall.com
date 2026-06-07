import { defineConfig } from 'vite'
import viteReact from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import { resolve } from 'node:path'

const fullReloadAlways = {
  handleHotUpdate({ server }) {
    server.ws.send({ type: 'full-reload' })
    return []
  },
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({ autoCodeSplitting: true }),
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
    chunkSizeWarningLimit: 1500, // Phaser is a large dependency
    // rollupOptions: {
    //   output: {
    //     manualChunks: (id) => {
    //       if (id.includes('phaser')) {
    //         return 'phaser'
    //       }
    //     },
    //   },
    // },
  },
})
