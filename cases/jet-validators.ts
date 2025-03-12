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

const checkFailed = (arg: unknown) => {
  if (arg === false) {
    throw new Error('Validation failed');
  } else {
    return arg;
  }
};

// **** Run Tests **** //

// Parse "safe"
createCase('jet-validators', 'parseSafe', () => {
  return data => checkFailed(safeParse(data));
});

// Parse "strict"
createCase('jet-validators', 'parseStrict', () => {
  return data => checkFailed(strictParse(data));
});

// Test "loose"
createCase('jet-validators', 'assertLoose', () => {
  return data => checkFailed(looseTest(data));
});

// Test "strict"
createCase('jet-validators', 'assertStrict', () => {
  return data => checkFailed(strictTest(data));
});
