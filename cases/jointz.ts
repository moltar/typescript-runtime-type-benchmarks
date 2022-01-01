import jointz from 'jointz';
import { createCase } from '../benchmarks';

createCase('jointz', 'validateLoose', () => {
  const dataType = jointz
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

  return data => {
    if (dataType.isValid(data)) {
      return data;
    }

    throw dataType.validate(data);
  };
});

createCase('jointz', 'validateStrict', () => {
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

  return data => {
    if (dataTypeStrict.isValid(data)) {
      return data;
    }

    throw dataTypeStrict.validate(data);
  };
});
