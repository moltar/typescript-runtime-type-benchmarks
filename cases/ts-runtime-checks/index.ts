import { assertLoose } from './build';
import { addCase } from '../../benchmarks';

addCase('ts-runtime-checks', 'assertLoose', assertLoose);
