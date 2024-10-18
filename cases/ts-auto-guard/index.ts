import { isLoose } from './build/index.guard';
import { addCase } from '../../benchmarks';

addCase('ts-auto-guard', 'assertLoose', data => {
  if (!isLoose(data)) throw new Error('wrong type.');
  return true;
});
