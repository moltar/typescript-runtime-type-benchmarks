import { isLoose } from './build/index.guard.js';
import { addCase } from '../../benchmarks/index.ts';

addCase('ts-auto-guard', 'assertLoose', data => {
  if (!isLoose(data)) throw new Error('wrong type.');
  return true;
});
