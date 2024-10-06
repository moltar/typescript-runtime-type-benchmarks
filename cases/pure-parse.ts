import { createCase } from '../benchmarks';
import { object, parseString, parseNumber, parseBoolean } from 'pure-parse';
// import {
//   object as v_object,
//   isString,
//   isNumber,
//   isBoolean,
// } from 'pure-parse/validate';

createCase('pure-parse', 'parseSafe', () => {
  const parseData = object({
    number: parseNumber,
    negNumber: parseNumber,
    maxNumber: parseNumber,
    string: parseString,
    longString: parseString,
    boolean: parseBoolean,
    deeplyNested: object({
      foo: parseString,
      num: parseNumber,
      bool: parseBoolean,
    }),
  });
  return (data: unknown) => {
    const res = parseData(data);
    if (res.tag === 'failure') {
      throw new Error('parsing failed');
    } else {
      return res.value;
    }
  };
});

// createCase('pure-parse', 'assertLoose', () =>
//   v_object({
//     number: isNumber,
//     negNumber: isNumber,
//     maxNumber: isNumber,
//     string: isString,
//     longString: isString,
//     boolean: isBoolean,
//     deeplyNested: v_object({
//       foo: isString,
//       num: isNumber,
//       bool: isBoolean,
//     }),
//   })
// );
