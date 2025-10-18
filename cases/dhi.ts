// @ts-expect-error - dhi uses package.json exports which require moduleResolution: "bundler" or "node16"
import { z } from 'dhi/schema';
import { createCase } from '../benchmarks';

createCase('dhi', 'parseSafe', () => {
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
  }); // Default behavior: strips unknown keys

  return data => {
    return dataType.parse(data);
  };
});

createCase('dhi', 'parseStrict', () => {
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
        .strict(), // Throw on unknown keys (nested)
    })
    .strict(); // Throw on unknown keys (root)

  return data => {
    return dataType.parse(data);
  };
});

createCase('dhi', 'assertLoose', () => {
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
        .passthrough(), // Allow unknown keys (nested)
    })
    .passthrough(); // Allow unknown keys (root)

  return data => {
    dataType.parse(data);
    return true;
  };
});

createCase('dhi', 'assertStrict', () => {
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
        .strict(), // Throw on unknown keys (nested)
    })
    .strict(); // Throw on unknown keys (root)

  return data => {
    dataType.parse(data);
    return true;
  };
});
