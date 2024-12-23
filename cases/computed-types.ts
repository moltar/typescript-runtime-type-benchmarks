// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import Schema, { boolean, number, string } from 'computed-types';
import { type UnknownData, addCase } from '../benchmarks/index.ts';

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
  { strict: true },
);

addCase('computed-types', 'parseSafe', (data: UnknownData) => {
  return validator(data);
});

addCase('computed-types', 'parseStrict', (data: UnknownData) => {
  return validatorStrict(data);
});

addCase('computed-types', 'assertStrict', (data: UnknownData) => {
  validatorStrict(data);

  return true;
});
