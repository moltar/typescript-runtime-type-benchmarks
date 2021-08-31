import { register } from '../benchmarks';
import * as v from '@badrap/valita';

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

register('valita', 'validate', data => {
  return dataType.parse(data);
});

register('valita', 'validateStrict', data => {
  return dataType.parse(data, { mode: 'strict' });
});
