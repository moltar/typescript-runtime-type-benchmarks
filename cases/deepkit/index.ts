import { parseSafe, assertLoose } from './build';
import { addCase } from '../../benchmarks';

addCase('deepkit', 'parseSafe', parseSafe);
addCase('deepkit', 'assertLoose', assertLoose);
