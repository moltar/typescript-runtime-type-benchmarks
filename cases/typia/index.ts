import { parseSafe, parseStrict, assertLoose, assertStrict } from './build';
import { addCase } from '../../benchmarks';

addCase('typia', 'parseSafe', parseSafe);
addCase('typia', 'parseStrict', parseStrict);
addCase('typia', 'assertStrict', assertStrict);
addCase('typia', 'assertLoose', assertLoose);
