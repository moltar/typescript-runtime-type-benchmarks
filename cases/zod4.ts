import * as z from 'zod4';
import { createCase } from '../benchmarks';

createCase('zod4', 'parseSafe', () => {
  const dataType = z.interface({
    number: z.number(),
    negNumber: z.number(),
    maxNumber: z.number(),
    string: z.string(),
    longString: z.string(),
    boolean: z.boolean(),
    deeplyNested: z.interface({
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
    .interface({
      number: z.number(),
      negNumber: z.number(),
      maxNumber: z.number(),
      string: z.string(),
      longString: z.string(),
      boolean: z.boolean(),
      deeplyNested: z
        .interface({
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
  const dataType = z.looseInterface({
    number: z.number(),
    negNumber: z.number(),
    maxNumber: z.number(),
    string: z.string(),
    longString: z.string(),
    boolean: z.boolean(),
    deeplyNested: z.looseInterface({
      foo: z.string(),
      num: z.number(),
      bool: z.boolean(),
    }),
  });

  return data => {
    dataType.parse(data);

    return true;
  };
});

createCase('zod4', 'assertStrict', () => {
  const dataType = z.strictInterface({
    number: z.number(),
    negNumber: z.number(),
    maxNumber: z.number(),
    string: z.string(),
    longString: z.string(),
    boolean: z.boolean(),
    deeplyNested: z.strictInterface({
      foo: z.string(),
      num: z.number(),
      bool: z.boolean(),
    }),
  });

  return data => {
    dataType.parse(data);

    return true;
  };
});
