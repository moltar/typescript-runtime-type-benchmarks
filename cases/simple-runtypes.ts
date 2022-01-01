import * as rt from 'simple-runtypes';
import { createCase } from '../benchmarks';

createCase('simple-runtypes', 'validate', () => {
  const checkData = rt.sloppyRecord({
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

  return data => {
    return checkData(data);
  };
});

createCase('simple-runtypes', 'validateStrict', () => {
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

  return data => {
    return checkDataStrict(data);
  };
});
