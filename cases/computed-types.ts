import Schema, { boolean, number, string } from 'computed-types';
import { createCase } from '../benchmarks';

createCase('computed-types', 'validate', () => {
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

  return (data: any) => {
    return validator(data);
  };
});

createCase('computed-types', 'validateStrict', () => {
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

  return (data: any) => {
    return validatorStrict(data);
  };
});
