import * as rt from 'simple-runtypes';
import { addCase } from '../benchmarks';

const checkDataSafe = rt.sloppyRecord({
  number: rt.integer(),
  negNumber: rt.number(),
  maxNumber: rt.number(),
  string: rt.string(),
  longString: rt.string(),
  boolean: rt.boolean(),
  deeplyNested: rt.sloppyRecord({
    foo: rt.string(),
    num: rt.number(),
    bool: rt.boolean(),
  }),
});

addCase('simple-runtypes', 'parseSafe', data => {
  return checkDataSafe(data);
});

const checkDataStrict = rt.record({
  number: rt.integer(),
  negNumber: rt.number(),
  maxNumber: rt.number(),
  string: rt.string(),
  longString: rt.string(),
  boolean: rt.boolean(),
  deeplyNested: rt.record({
    foo: rt.string(),
    num: rt.number(),
    bool: rt.boolean(),
  }),
});

addCase('simple-runtypes', 'parseStrict', data => {
  return checkDataStrict(data);
});

addCase('simple-runtypes', 'assertStrict', data => {
  checkDataStrict(data);

  return true;
});
