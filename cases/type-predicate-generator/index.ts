// Importing a manually minified version because the test suite
// is using ts-node that does not perform code minification
// that Type Predicate Generator relies on for peak performance.
// In GH codespace the numbers improved from 136.1M to 159.0M ops/s.
import { isLoose } from './build/index_guards';
import { addCase } from '../../benchmarks';

addCase('type-predicate-generator', 'assertLoose', data => {
  if (!isLoose(data)) throw new Error('wrong type.');
  return true;
});
