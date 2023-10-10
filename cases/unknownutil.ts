import { is, ensure, assert } from 'unknownutil';
import { createCase } from '../benchmarks';

const dataTypeLoose = is.ObjectOf({
  number: is.Number,
  negNumber: is.Number,
  maxNumber: is.Number,
  string: is.String,
  longString: is.String,
  boolean: is.Boolean,
  deeplyNested: is.ObjectOf({
    foo: is.String,
    num: is.Number,
    bool: is.Boolean,
  }),
});

const dataTypeStrict = is.ObjectOf(
  {
    number: is.Number,
    negNumber: is.Number,
    maxNumber: is.Number,
    string: is.String,
    longString: is.String,
    boolean: is.Boolean,
    deeplyNested: is.ObjectOf(
      {
        foo: is.String,
        num: is.Number,
        bool: is.Boolean,
      },
      { strict: true }
    ),
  },
  { strict: true }
);

// TODO: unklike other validators, unknownutil does not remove extra properties
// createCase('unknownutil', 'parseSafe', () => {
//   return data => {
//     return ensure(data, dataTypeLoose);
//   };
// });

createCase('unknownutil', 'parseStrict', () => {
  return data => {
    return ensure(data, dataTypeStrict);
  };
});

createCase('unknownutil', 'assertStrict', () => {
  return data => {
    assert(data, dataTypeStrict);
    return true;
  };
});

createCase('unknownutil', 'assertLoose', () => {
  return data => {
    assert(data, dataTypeLoose);
    return true;
  };
});
