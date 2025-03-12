import { isString, isNumber, isBoolean } from 'jet-validators';

import {
  parseObject,
  testObject,
  looseTestObject,
  strictParseObject,
  strictTestObject,
} from 'jet-validators/utils';

import { createCase } from '../benchmarks';

// **** Init Schema **** //

const safeParse = parseObject({
  number: isNumber,
  negNumber: isNumber,
  maxNumber: isNumber,
  string: isString,
  longString: isString,
  boolean: isBoolean,
  deeplyNested: testObject({
    foo: isString,
    num: isNumber,
    bool: isBoolean,
  }),
});

const looseTest = looseTestObject({
  number: isNumber,
  negNumber: isNumber,
  maxNumber: isNumber,
  string: isString,
  longString: isString,
  boolean: isBoolean,
  deeplyNested: looseTestObject({
    foo: isString,
    num: isNumber,
    bool: isBoolean,
  }),
});

const strictParse = strictParseObject({
  number: isNumber,
  negNumber: isNumber,
  maxNumber: isNumber,
  string: isString,
  longString: isString,
  boolean: isBoolean,
  deeplyNested: strictTestObject({
    foo: isString,
    num: isNumber,
    bool: isBoolean,
  }),
});

const strictTest = strictTestObject({
  number: isNumber,
  negNumber: isNumber,
  maxNumber: isNumber,
  string: isString,
  longString: isString,
  boolean: isBoolean,
  deeplyNested: strictTestObject({
    foo: isString,
    num: isNumber,
    bool: isBoolean,
  }),
});

// **** Run Tests **** //

// Parse "safe"
createCase('jet-validators', 'parseSafe', () => {
  return data => {
    return safeParse(data);
  };
});

// Parse "strict"
createCase('jet-validators', 'parseStrict', () => {
  return data => {
    return strictParse(data);
  };
});

// Test "loose"
createCase('jet-validators', 'assertLoose', () => {
  return data => {
    return looseTest(data);
  };
});

// Test "strict"
createCase('jet-validators', 'assertStrict', () => {
  return data => {
    return strictTest(data);
  };
});
