import { ArkErrors, type } from 'arktype';
import { createCase } from '../benchmarks';

// As of version 2.1.9, the test fails because of a mutation attempt
// createCase('arktype', 'parseSafe', () => {
//   const t = type({
//     '+': 'delete',
//     number: 'number',
//     negNumber: 'number',
//     maxNumber: 'number',
//     string: 'string',
//     longString: 'string',
//     boolean: 'boolean',
//     deeplyNested: {
//       '+': 'delete',
//       foo: 'string',
//       num: 'number',
//       bool: 'boolean',
//     },
//   });
//   return data => {
//     const r = t(data);
//     if (r instanceof ArkErrors) throw r;
//     return r;
//   };
// });

createCase('arktype', 'parseStrict', () => {
  const t = type({
    '+': 'reject',
    number: 'number',
    negNumber: 'number',
    maxNumber: 'number',
    string: 'string',
    longString: 'string',
    boolean: 'boolean',
    deeplyNested: {
      '+': 'reject',
      foo: 'string',
      num: 'number',
      bool: 'boolean',
    },
  });
  return data => {
    const r = t(data);
    if (r instanceof ArkErrors) throw r;
    return r;
  };
});

createCase('arktype', 'assertLoose', () => {
  const t = type({
    number: 'number',
    negNumber: 'number',
    maxNumber: 'number',
    string: 'string',
    longString: 'string',
    boolean: 'boolean',
    deeplyNested: {
      foo: 'string',
      num: 'number',
      bool: 'boolean',
    },
  });

  return data => {
    if (t.allows(data)) return true;
    throw new Error('Invalid');
  };
});

createCase('arktype', 'assertStrict', () => {
  const t = type({
    '+': 'reject',
    number: 'number',
    negNumber: 'number',
    maxNumber: 'number',
    string: 'string',
    longString: 'string',
    boolean: 'boolean',
    deeplyNested: {
      '+': 'reject',
      foo: 'string',
      num: 'number',
      bool: 'boolean',
    },
  });

  return data => {
    if (t.allows(data)) return true;
    throw new Error('Invalid');
  };
});
