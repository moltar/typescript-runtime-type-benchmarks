import { lt } from '@gapstack/light-type';
import { createCase } from '../benchmarks';

createCase('light-type', 'parseSafe', () => {
  const dataType = lt.object({
    number: lt.number(),
    negNumber: lt.number(),
    maxNumber: lt.number(),
    string: lt.string(),
    longString: lt.string(),
    boolean: lt.boolean(),
    deeplyNested: lt.object({
      foo: lt.string(),
      num: lt.number(),
      bool: lt.boolean(),
    }),
  });

  return data => {
    return dataType.parse(data);
  };
});

createCase('light-type', 'parseStrict', () => {
  const dataType = lt
    .object({
      number: lt.number(),
      negNumber: lt.number(),
      maxNumber: lt.number(),
      string: lt.string(),
      longString: lt.string(),
      boolean: lt.boolean(),
      deeplyNested: lt
        .object({
          foo: lt.string(),
          num: lt.number(),
          bool: lt.boolean(),
        })
        .strict(),
    })
    .strict();

  return data => {
    return dataType.parse(data);
  };
});

createCase('light-type', 'assertLoose', () => {
  const dataType = lt
    .object({
      number: lt.number(),
      negNumber: lt.number(),
      maxNumber: lt.number(),
      string: lt.string(),
      longString: lt.string(),
      boolean: lt.boolean(),
      deeplyNested: lt
        .object({
          foo: lt.string(),
          num: lt.number(),
          bool: lt.boolean(),
        })
        .passthrough(),
    })
    .passthrough();

  return data => {
    dataType.parse(data);

    return true;
  };
});

createCase('light-type', 'assertStrict', () => {
  const dataType = lt
    .object({
      number: lt.number(),
      negNumber: lt.number(),
      maxNumber: lt.number(),
      string: lt.string(),
      longString: lt.string(),
      boolean: lt.boolean(),
      deeplyNested: lt
        .object({
          foo: lt.string(),
          num: lt.number(),
          bool: lt.boolean(),
        })
        .strict(),
    })
    .strict();

  return data => {
    dataType.parse(data);

    return true;
  };
});
