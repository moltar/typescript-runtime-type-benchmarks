import { Boolean, Number, String, Record } from 'runtypes';
import { register } from '../benchmarks';

const dataType = Record({
  number: Number,
  negNumber: Number,
  maxNumber: Number,
  string: String,
  longString: String,
  boolean: Boolean,
  deeplyNested: Record({
    foo: String,
    num: Number,
    bool: Boolean,
  }),
});

register('runtypes', 'validate', data => {
  return dataType.check(data);
});
