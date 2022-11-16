import { assertStrict, assertLoose, parseStrict } from './build';
import { addCase } from '../../benchmarks';

addCase('ts-runtime-checks', 'parseStrict', parseStrict);

addCase('ts-runtime-checks', 'assertStrict', assertStrict);

addCase('ts-runtime-checks', 'assertLoose', assertLoose);
