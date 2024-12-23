import { parseSafe, assertLoose } from './build/index.js';
import { addCase } from '../../benchmarks/index.ts';

addCase('deepkit', 'parseSafe', data => {
  return parseSafe(data);
});
addCase('deepkit', 'assertLoose', data => {
  return assertLoose(data);
});
