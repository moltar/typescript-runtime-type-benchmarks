import preact from '@preact/preset-vite';
import { defineConfig } from 'vite';

export default defineConfig({
  // base dir for gh-pages
  base: 'typescript-runtime-type-benchmarks/',
  plugins: [preact()],
});
