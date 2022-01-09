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

addCase('computed-types', 'parseSafe', (data: any) => {
  return validator(data);
});

addCase('computed-types', 'parseStrict', (data: any) => {
  return validatorStrict(data);
});

addCase('computed-types', 'assertStrict', (data: any) => {
  validatorStrict(data);

  return true;
});
