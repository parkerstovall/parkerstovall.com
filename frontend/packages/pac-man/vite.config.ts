import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'

export default defineConfig({
  plugins: [dts({
    bundleTypes: true,
  }), react()],
  build: {
    lib: {
      entry: 'src/index.ts',
      formats: ['es'],
      fileName: 'index' 
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'phaser']
    }
  }
})