import { createCase } from '../benchmarks';
import { object, isString, isNumber, isBoolean } from 'pure-parse';

createCase('pure-parse', 'parseSafe', () =>
  object({
    number: isNumber,
    negNumber: isNumber,
    maxNumber: isNumber,
    string: isString,
    longString: isString,
    boolean: isBoolean,
    deeplyNested: object({
      foo: isString,
      num: isNumber,
      bool: isBoolean,
    }),
  })
);

createCase('pure-parse', 'parseStrict', () =>
  object({
    number: isNumber,
    negNumber: isNumber,
    maxNumber: isNumber,
    string: isString,
    longString: isString,
    boolean: isBoolean,
    deeplyNested: object({
      foo: isString,
      num: isNumber,
      bool: isBoolean,
    }),
  })
);

createCase('pure-parse', 'assertLoose', () =>
  object({
    number: isNumber,
    negNumber: isNumber,
    maxNumber: isNumber,
    string: isString,
    longString: isString,
    boolean: isBoolean,
    deeplyNested: object({
      foo: isString,
      num: isNumber,
      bool: isBoolean,
    }),
  })
);

createCase('pure-parse', 'assertStrict', () =>
  object({
    number: isNumber,
    negNumber: isNumber,
    maxNumber: isNumber,
    string: isString,
    longString: isString,
    boolean: isBoolean,
    deeplyNested: object({
      foo: isString,
      num: isNumber,
      bool: isBoolean,
    }),
  })
);
