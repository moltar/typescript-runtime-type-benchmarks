import {
  validate,
  hasUnknownKeys,
  stripUnknownKeys,
  type ToBeChecked,
  // Import the built module explicitly (not the `./build` directory): the
  // directory also contains `index.d.ts`, which some resolvers (e.g. Vitest's)
  // pick ahead of `index.js`, yielding a types-only module with no runtime.
} from './build/index.js';
import { addCase } from '../../benchmarks';

// `ts-runtypes` (the scoped `@ts-runtypes/*` project, distinct from the older
// unscoped `runtypes` package) compiles validators from TypeScript types ahead
// of time. `validate` is a loose type guard that ignores unknown keys, so the
// strict modes additionally reject unknown keys via `hasUnknownKeys` (which
// checks nested objects too).
const isStrict = (data: unknown): data is ToBeChecked =>
  validate(data) && !hasUnknownKeys(data);

addCase('ts-runtypes', 'parseSafe', data => {
  if (!validate(data)) throw new Error('wrong type.');
  return stripUnknownKeys(data);
});

addCase('ts-runtypes', 'parseStrict', data => {
  if (!isStrict(data)) throw new Error('wrong type.');
  return data;
});

addCase('ts-runtypes', 'assertLoose', data => {
  if (!validate(data)) throw new Error('wrong type.');
  return true;
});

addCase('ts-runtypes', 'assertStrict', data => {
  if (!isStrict(data)) throw new Error('wrong type.');
  return true;
});
