import * as z from 'zod';
import { createCase } from '../benchmarks';

createCase('zod-compiled', 'parseSafe', () => {
  const dataType = z.compile(
    z.object({
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
    }),
  );

  return data => {
    return dataType.parse(data);
  };
});

createCase('zod-compiled', 'parseStrict', () => {
  const dataType = z.compile(
    z
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
      .strict(),
  );

  return data => {
    return dataType.parse(data);
  };
});

createCase('zod-compiled', 'assertLoose', () => {
  const dataType = z.compile(
    z
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
      .passthrough(),
  );

  return data => {
    if (!z.validate(dataType, data)) throw new Error('Invalid');

    return true;
  };
});

createCase('zod-compiled', 'assertStrict', () => {
  const dataType = z.compile(
    z
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
      .strict(),
  );

  return data => {
    if (!z.validate(dataType, data)) throw new Error('Invalid');

    return true;
  };
});
