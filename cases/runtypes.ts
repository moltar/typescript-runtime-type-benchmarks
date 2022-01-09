import { Boolean, Number, String, Record } from 'runtypes';
import { createCase } from '../benchmarks';

createCase('runtypes', 'assertLoose', () => {
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

  return data => {
    dataType.check(data);

    return true;
  };
});
