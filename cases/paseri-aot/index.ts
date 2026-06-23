import { DataTypeStrip, DataTypeStrict, DataTypePassthrough } from './build';
import { addCase } from '../../benchmarks';

// Ahead-of-time compiled counterpart to the runtime `paseri` case. The parsers
// are generated from identical schemas by `@paseri/compiler` (see
// `src/generate.ts`), so this measures the compiled parser against the runtime
// one over the same shapes.

addCase('paseri-(ahead-of-time)', 'parseSafe', data => {
  return DataTypeStrip.parse(data);
});

addCase('paseri-(ahead-of-time)', 'parseStrict', data => {
  return DataTypeStrict.parse(data);
});

addCase('paseri-(ahead-of-time)', 'assertLoose', data => {
  DataTypePassthrough.parse(data);

  return true;
});

addCase('paseri-(ahead-of-time)', 'assertStrict', data => {
  DataTypeStrict.parse(data);

  return true;
});
