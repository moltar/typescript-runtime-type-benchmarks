import * as v from '@badrap/valita';
import { addCase } from '../benchmarks';

const dataType = v.object({
  number: v.number(),
  negNumber: v.number(),
  maxNumber: v.number(),
  string: v.string(),
  longString: v.string(),
  boolean: v.boolean(),
  deeplyNested: v.object({
    foo: v.string(),
    num: v.number(),
    bool: v.boolean(),
  }),
});

addCase('valita', 'parseSafe', data => {
  return dataType.parse(data, { mode: 'strip' });
});

addCase('valita', 'parseStrict', data => {
  return dataType.parse(data, { mode: 'strict' });
});

addCase('valita', 'assertLoose', data => {
  dataType.parse(data, { mode: 'passthrough' });

  return true;
});

addCase('valita', 'assertStrict', data => {
  dataType.parse(data, { mode: 'strict' });

  return true;
});
