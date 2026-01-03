import * as z from 'zod4';
import { createCase } from '../benchmarks';

createCase('zod4', 'parseSafe', () => {
  const dataType = z.object({
    number: z.number(),
    negNumber: z.number(),
    maxNumber: z.number(),
    string: z.string(),
    longString: z.string(),
    boolean: z.boolean(),
    deeplyNested: z.object({
      foo: z.string(),
      num: z.number(),
      bool: z.boolean(),
    }),
  });

  return data => {
    return dataType.parse(data);
  };
});

createCase('zod4', 'parseStrict', () => {
  const dataType = z
    .object({
      number: z.number(),
      negNumber: z.number(),
      maxNumber: z.number(),
      string: z.string(),
      longString: z.string(),
      boolean: z.boolean(),
      deeplyNested: z
        .object({
          foo: z.string(),
          num: z.number(),
          bool: z.boolean(),
        })
        .strict(),
    })
    .strict();

  return data => {
    return dataType.parse(data);
  };
});

createCase('zod4', 'assertLoose', () => {
  const dataType = z
    .object({
      number: z.number(),
      negNumber: z.number(),
      maxNumber: z.number(),
      string: z.string(),
      longString: z.string(),
      boolean: z.boolean(),
      deeplyNested: z
        .object({
          foo: z.string(),
          num: z.number(),
          bool: z.boolean(),
        })
        .passthrough(),
    })
    .passthrough();

  return data => {
    dataType.parse(data);

    return true;
  };
});

createCase('zod4', 'assertStrict', () => {
  const dataType = z
    .object({
      number: z.number(),
      negNumber: z.number(),
      maxNumber: z.number(),
      string: z.string(),
      longString: z.string(),
      boolean: z.boolean(),
      deeplyNested: z
        .object({
          foo: z.string(),
          num: z.number(),
          bool: z.boolean(),
        })
        .strict(),
    })
    .strict();

  return data => {
    dataType.parse(data);

    return true;
  };
});
