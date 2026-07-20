// Build step for the `ts-runtypes` benchmark case.
//
// `ts-runtypes` generates its validators from TypeScript types at build time.
// We run its official esbuild plugin over `src/index.ts` and bundle the result
// into a single, self-contained CommonJS module at `build/index.js` that the
// case (`index.ts`) consumes at runtime — the same shape other codegen cases
// (e.g. paseri) use. The plugin drives the prebuilt `@ts-runtypes/bin` compiler
// binary; no Go toolchain is required.
//
// The `customConditions: ["source"]` entry in `tsconfig.json` is required so the
// compiler can resolve `@ts-runtypes/core`'s TypeScript sources (and therefore
// its build-time type markers); without it every type resolves to an empty
// runtype.
//
// The case (`../index.ts`) imports the built module by its explicit `index.js`
// path rather than the `./build` directory: the directory also holds the
// generated `index.d.ts`, which some resolvers (notably Vitest's) pick ahead of
// `index.js`, yielding a types-only module with no runtime values.
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import esbuild from 'esbuild';
import runtypes from '@ts-runtypes/devtools/esbuild';

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
  // `emitMode: 'functions'` makes the compiler emit real validator functions
  // directly, rather than the default `'code'` mode, which ships each validator
  // as serialized params/body strings that are rebuilt at runtime via
  // `new Function(...)`. Emitting functions avoids that runtime reconstruction.
  plugins: [
    runtypes({ cwd: here, tsconfig: 'tsconfig.json', emitMode: 'functions' }),
  ],
});
