import {
  validate,
  validateStrict,
  removeUnknownKeys,
  // Import the built module explicitly (not the `./build` directory): the
  // directory also contains `index.d.ts`, which some resolvers (e.g. Vitest's)
  // pick ahead of `index.js`, yielding a types-only module with no runtime.
} from './build/index.js';
import { addCase } from '../../benchmarks';

// `@mionjs/run-types` compiles validators from TypeScript types ahead of time.
// `validate` is a loose type guard that ignores unknown keys; `validateStrict`
// also rejects unknown keys (nested objects included) in the same pass.

addCase('@mionjs/run-types', 'parseSafe', data => {
  if (!validate(data)) throw new Error('wrong type.');
  // Clone-based strip: returns a fresh object built from the declared shape, so
  // unknown keys are dropped by construction (input is not mutated).
  return removeUnknownKeys(data);
});

addCase('@mionjs/run-types', 'parseStrict', data => {
  if (!validateStrict(data)) throw new Error('wrong type.');
  return data;
});

addCase('@mionjs/run-types', 'assertLoose', data => {
  if (!validate(data)) throw new Error('wrong type.');
  return true;
});

addCase('@mionjs/run-types', 'assertStrict', data => {
  if (!validateStrict(data)) throw new Error('wrong type.');
  return true;
});
