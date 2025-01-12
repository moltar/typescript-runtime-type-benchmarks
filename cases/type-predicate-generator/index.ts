import { isLoose } from './src/index_guards.ts';
import { addCase } from '../../benchmarks';

addCase('type-predicate-generator', 'assertLoose', data => {
  if (!isLoose(data)) throw new Error('wrong type.');
  return true;
});
