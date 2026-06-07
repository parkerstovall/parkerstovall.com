import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import pluginPrettier from "eslint-plugin-prettier/recommended";

export default defineConfig([
  {
    files: ["**/*.{ts,tsx}"],
    ignores: ["**/dist/**", "**/node_modules/**"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  pluginPrettier,
]);
