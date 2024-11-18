import { schema } from 'jet-schema';
import { createCase } from '../benchmarks';


// Parse "loose"
createCase('jet-schema', 'parseSafe', () => {
  const dataType = schema({
    number: isNum,
    negNumber: isNum,
    maxNumber: isNum,
    string: isStr,
    longString: isStr,
    boolean: isBool,
    deeplyNested: schema({
      foo: isStr,
      num: isNum,
      bool: isBool,
    }),
  });
  // Return
  return data => {
    return dataType.parse(data);
  };
});


// Parse "strict"
// createCase('zod', 'parseStrict', () => {
//   const dataType = schema({
//       number: isNum,
//       negNumber: isNum,
//       maxNumber: isNum,
//       string: isNum,
//       longString: isStr,
//       boolean: isBool,
//       deeplyNested: schema({
//           foo: isStr,
//           num: isNum,
//           bool: isBool,
//         }, { strict: 'high' }),
//     }, { safety: 'high' });
//   // Return
//   return data => {
//     return dataType.parse(data);
//   };
// });


// Parse "pass"
// createCase('zod', 'assertLoose', () => {
//   const dataType = schema({
//       number: isNum,
//       negNumber: isNum,
//       maxNumber: isNum,
//       string: isStr,
//       longString: isStr,
//       boolean: isBool,
//       deeplyNested: schema({
//           foo: isStr,
//           num: isNum,
//           bool: isBool,
//         }, { strict: 'low' }),
//     }, { strict: 'low' });
//   // Return
//   return data => {
//     return dataType.parse(data);
//   };
// });


// Test "strict"
// createCase('zod', 'assertStrict', () => {
//   const dataType = schema({
//     number: isNum,
//     negNumber: isNum,
//     maxNumber: isNum,
//     string: isStr,
//     longString: isStr,
//     boolean: isBool,
//     deeplyNested: schema({
//       foo: isStr,
//       num: isNum,
//       bool: isBool,
//     }, { strict: 'high' }),
//   }, { strict: 'high' });
//   // Return
//   return data => {
//     dataType.parse(data);
//     return true;
//   };
// });


// **** Validators **** //

function isNum(arg: unknown): arg is number {
  return typeof arg === 'number';
}

function isStr(arg: unknown): arg is string {
  return typeof arg === 'string';
}

function isBool(arg: unknown): arg is boolean {
  return typeof arg === 'boolean';
}
