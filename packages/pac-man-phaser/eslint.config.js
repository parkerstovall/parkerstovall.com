import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import { defineConfig } from 'eslint/config'
import pluginPrettier from 'eslint-plugin-prettier/recommended'
import unusedImports from 'eslint-plugin-unused-imports'

export default defineConfig([
  {
    files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: { js, 'unused-imports': unusedImports },
    extends: ['js/recommended'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'], // Or an array of tsconfig paths
        tsconfigRootDir: import.meta.dirname, // or __dirname for CommonJS
      },
    },
  },
  {
    files: ['./src/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginPrettier,
  {
    rules: {
      'unused-imports/no-unused-imports': 'warn',
    },
  },
])
