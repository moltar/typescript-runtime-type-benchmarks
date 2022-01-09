import { boolean, exact, guard, number, object, string } from 'decoders';
import { createCase } from '../benchmarks';

createCase('decoders', 'parseSafe', () => {
  const dataType = object({
    number,
    negNumber: number,
    maxNumber: number,
    string,
    longString: string,
    boolean,
    deeplyNested: object({
      foo: string,
      num: number,
      bool: boolean,
    }),
  });

  const dataTypeGuard = guard(dataType);

  return data => {
    return dataTypeGuard(data);
  };
});

const dataTypeStrict = exact({
  number,
  negNumber: number,
  maxNumber: number,
  string,
  longString: string,
  boolean,
  deeplyNested: exact({
    foo: string,
    num: number,
    bool: boolean,
  }),
});

createCase('decoders', 'parseStrict', () => {
  const dataTypeGuardStrict = guard(dataTypeStrict);

  return data => {
    return dataTypeGuardStrict(data);
  };
});

createCase('decoders', 'assertStrict', () => {
  const dataTypeGuardStrict = guard(dataTypeStrict);

  return data => {
    dataTypeGuardStrict(data);

    return true;
  };
});
