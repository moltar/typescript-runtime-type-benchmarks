import jointz from 'jointz';
import { addCase } from '../benchmarks';

const dataTypeLoose = jointz
  .object({
    number: jointz.number(),
    negNumber: jointz.number(),
    maxNumber: jointz.number(),
    string: jointz.string(),
    longString: jointz.string(),
    boolean: jointz.constant(true, false),
    deeplyNested: jointz
      .object({
        foo: jointz.string(),
        num: jointz.number(),
        bool: jointz.constant(true, false),
      })
      .requiredKeys('foo', 'num', 'bool')
      .allowUnknownKeys(true),
  })
  .requiredKeys([
    'number',
    'boolean',
    'deeplyNested',
    'longString',
    'maxNumber',
    'negNumber',
    'number',
    'string',
  ])
  .allowUnknownKeys(true);

const dataTypeStrict = jointz
  .object({
    number: jointz.number(),
    negNumber: jointz.number(),
    maxNumber: jointz.number(),
    string: jointz.string(),
    longString: jointz.string(),
    boolean: jointz.constant(true, false),
    deeplyNested: jointz
      .object({
        foo: jointz.string(),
        num: jointz.number(),
        bool: jointz.constant(true, false),
      })
      .requiredKeys('foo', 'num', 'bool'),
  })
  .requiredKeys([
    'number',
    'boolean',
    'deeplyNested',
    'longString',
    'maxNumber',
    'negNumber',
    'number',
    'string',
  ]);

addCase('jointz', 'assertLoose', data => {
  const errors = dataTypeLoose.validate(data);

  if (errors.length) {
    throw errors;
  }

  return true;
});

addCase('jointz', 'assertStrict', data => {
  const errors = dataTypeStrict.validate(data);

  if (errors.length) {
    throw errors;
  }

  return true;
});

addCase('jointz', 'parseStrict', data => {
  if (dataTypeStrict.isValid(data)) {
    return data;
  }

  throw dataTypeStrict.validate(data);
});
