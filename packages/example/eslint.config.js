import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import { defineConfig } from 'eslint/config'
import pluginPrettier from 'eslint-plugin-prettier/recommended'
import unusedImports from 'eslint-plugin-unused-imports'

export default defineConfig([
  {
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.app.json'], // Or an array of tsconfig paths
        tsconfigRootDir: import.meta.dirname, // or __dirname for CommonJS
      },
    },
    files: ['./src/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    plugins: { js, pluginReact, 'unused-imports': unusedImports },
    extends: ['js/recommended'],
  },
  {
    files: ['./src/**/*.{js,mjs,cjs,ts,jsx,tsx}'],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  pluginPrettier,
  {
    rules: {
      'react/react-in-jsx-scope': 'off',
      'react/jsx-uses-react': 'off',
      'unused-imports/no-unused-imports': 'warn',
    },
  },
])
