// Build step for the `@mionjs/run-types` benchmark case.
//
// `@mionjs/run-types` generates its validators from TypeScript types at build
// time. We run its official esbuild plugin (`@mionjs/devtools`) over
// `src/index.ts` and bundle the result into a single, self-contained CommonJS
// module at `build/index.js` that the case (`index.ts`) consumes at runtime —
// the same shape other codegen cases (e.g. paseri) use. The plugin drives the
// prebuilt compiler binary from `@mionjs/bin-compiler`; no Go toolchain is
// required.
//
// The case (`../index.ts`) imports the built module by its explicit `index.js`
// path rather than the `./build` directory: the directory also holds the
// generated `index.d.ts`, which some resolvers (notably Vitest's) pick ahead of
// `index.js`, yielding a types-only module with no runtime values.
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';
import runtypes from '@mionjs/devtools/runtypes/esbuild';

const here = dirname(fileURLToPath(import.meta.url));

await esbuild.build({
  absWorkingDir: here,
  entryPoints: ['./src/index.ts'],
  bundle: true,
  platform: 'node',
  format: 'cjs',
  target: 'es2021',
  outfile: 'build/index.js',
  logLevel: 'warning',
  plugins: [
    runtypes({
      cwd: here,
      tsconfig: 'tsconfig.json',
      // Keep the compiler cache out of `src/` (it is git-ignored either way).
      genDir: 'build/.mion',
      // Ship ready-made validator functions instead of the default `'code'`
      // mode, which ships each validator as a string and rebuilds it at
      // runtime via `new Function(...)` on first use.
      emitMode: 'functions',
      // Check numbers with `typeof v === 'number'` (like ajv, typia, typebox
      // and JSON Schema) instead of the default `Number.isFinite`, which also
      // rejects `NaN` / `Infinity`. Applies to every validator in the case.
      validate: { numberMode: 'typeof' },
    }),
  ],
});
