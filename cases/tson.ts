import { t } from '@skarab/tson';
import { createCase } from '../benchmarks';

createCase('tson', 'parseSafe', () => {
  const dataType = t
    .object({
      number: t.number(),
      negNumber: t.number(),
      maxNumber: t.number(),
      string: t.string(),
      longString: t.string(),
      boolean: t.boolean(),
      deeplyNested: t
        .object({
          foo: t.string(),
          num: t.number(),
          bool: t.boolean(),
        })
        .strip(),
    })
    .strip();

  return data => {
    return dataType.parse(data);
  };
});

createCase('tson', 'parseStrict', () => {
  const dataType = t
    .object({
      number: t.number(),
      negNumber: t.number(),
      maxNumber: t.number(),
      string: t.string(),
      longString: t.string(),
      boolean: t.boolean(),
      deeplyNested: t
        .object({
          foo: t.string(),
          num: t.number(),
          bool: t.boolean(),
        })
        .strict(),
    })
    .strict();

  return data => {
    return dataType.parse(data);
  };
});

createCase('tson', 'assertLoose', () => {
  const dataType = t
    .object({
      number: t.number(),
      negNumber: t.number(),
      maxNumber: t.number(),
      string: t.string(),
      longString: t.string(),
      boolean: t.boolean(),
      deeplyNested: t
        .object({
          foo: t.string(),
          num: t.number(),
          bool: t.boolean(),
        })
        .passthrough(),
    })
    .passthrough();

  return data => {
    dataType.parse(data);

    return true;
  };
});

createCase('tson', 'assertStrict', () => {
  const dataType = t
    .object({
      number: t.number(),
      negNumber: t.number(),
      maxNumber: t.number(),
      string: t.string(),
      longString: t.string(),
      boolean: t.boolean(),
      deeplyNested: t
        .object({
          foo: t.string(),
          num: t.number(),
          bool: t.boolean(),
        })
        .strict(),
    })
    .strict();

  return data => {
    dataType.parse(data);

    return true;
  };
});
