import { isValidLoose, isValidStrict } from './build';
import { createCase } from '../../benchmarks';

// Ahead-of-time counterpart to the runtime `ata` case. `ata compile` turns a
// JSON Schema into a module that imports nothing, which is what this entry
// loads; `src/generate.ts` produces those modules from the same schemas the
// runtime case uses, so the difference measured is where the validator is
// built rather than what it checks.

createCase('ata-(ahead-of-time)', 'assertLoose', () => {
  return data => {
    if (!isValidLoose(data)) {
      throw new Error('invalid');
    }

    return true;
  };
});

createCase('ata-(ahead-of-time)', 'assertStrict', () => {
  return data => {
    if (!isValidStrict(data)) {
      throw new Error('invalid');
    }

    return true;
  };
});
