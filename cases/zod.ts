import * as z from 'zod';
import { createCase } from '../benchmarks';

createCase('zod', 'validate', () => {
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

createCase('zod', 'validateStrict', () => {
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

createCase('zod', 'validateLoose', () => {
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
    return dataType.parse(data);
  };
});
