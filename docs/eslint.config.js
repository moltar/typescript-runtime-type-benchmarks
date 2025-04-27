// generated with `npm init @eslint/config@latest`
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
  globalIgnores(['dist', 'eslint.config.js']),
  {
    files: ['src/**/*.{ts, tsx}'],
    plugins: { js },
    extends: ['js/recommended'],
  },
  {
    files: ['src/**/*.{ts, tsx}'],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
]);
