import {
  parseDataTypeStrip,
  parseDataTypeStrict,
  parseDataTypePassthrough,
} from './build';
import { addCase } from '../../benchmarks';

// Ahead-of-time compiled counterpart to the runtime `paseri` case. The parsers
// are generated from identical schemas by `@paseri/compiler` (see
// `src/generate.ts`), so this measures the compiled parser against the runtime
// one over the same shapes.

addCase('paseri-(ahead-of-time)', 'parseSafe', data => {
  return parseDataTypeStrip(data);
});

addCase('paseri-(ahead-of-time)', 'parseStrict', data => {
  return parseDataTypeStrict(data);
});

addCase('paseri-(ahead-of-time)', 'assertLoose', data => {
  parseDataTypePassthrough(data);

  return true;
});

addCase('paseri-(ahead-of-time)', 'assertStrict', data => {
  parseDataTypeStrict(data);

  return true;
});
