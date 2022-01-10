import Schema, { boolean, number, string } from 'computed-types';
import { addCase } from '../benchmarks';

const validator = Schema({
  number: number,
  negNumber: number.lt(0),
  maxNumber: number,
  string: string,
  longString: string,
  boolean: boolean,
  deeplyNested: {
    foo: string,
    num: number,
    bool: boolean,
  },
});

const validatorStrict = Schema(
  {
    number: number,
    negNumber: number.lt(0),
    maxNumber: number,
    string: string,
    longString: string,
    boolean: boolean,
    deeplyNested: {
      foo: string,
      num: number,
      bool: boolean,
    },
  },
  { strict: true }
);

addCase(
  'computed-types',
  'parseSafe',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (data: any) => {
    return validator(data);
  }
);

addCase(
  'computed-types',
  'parseStrict',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (data: any) => {
    return validatorStrict(data);
  }
);

addCase(
  'computed-types',
  'assertStrict',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (data: any) => {
    validatorStrict(data);

    return true;
  }
);
