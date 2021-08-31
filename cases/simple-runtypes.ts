import * as rt from 'simple-runtypes';
import { register } from '../benchmarks';

const checkData = rt.record({
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

register('simple-runtypes', 'validate', data => {
  return checkData(data);
});

register('simple-runtypes', 'validateStrict', data => {
  return checkData(data);
});
