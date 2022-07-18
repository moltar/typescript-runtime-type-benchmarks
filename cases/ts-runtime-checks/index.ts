import { parseStrict, assertLoose } from './build';
import { addCase } from '../../benchmarks';

addCase('ts-runtime-checks', 'parseStrict', parseStrict);

addCase('ts-runtime-checks', 'assertLoose', assertLoose);

addCase('ts-runtime-checks', 'assertStrict', parseStrict);
