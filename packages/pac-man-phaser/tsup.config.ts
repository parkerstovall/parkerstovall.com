import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'], // produce ESM output
  dts: true, // generate TypeScript declarations
  outDir: 'dist',
  bundle: true, // bundle everything, including assets
  esbuildOptions: (options) => {
    // tell esbuild to treat .webp as a file and return a URL string
    options.loader = { ...options.loader, '.webp': 'dataurl' }
  },
})
