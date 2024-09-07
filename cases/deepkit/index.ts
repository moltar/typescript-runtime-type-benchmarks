import { parseSafe, assertLoose } from './build';
import { addCase } from '../../benchmarks';

addCase('deepkit', 'parseSafe', data => {
  return parseSafe(data);
});
addCase('deepkit', 'assertLoose', data => {
  return assertLoose(data);
});
