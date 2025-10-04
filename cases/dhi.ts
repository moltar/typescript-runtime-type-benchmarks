import { z } from 'dhi/schema';
import { createCase } from '../benchmarks';

// Note: dhi doesn't support .strict() or .passthrough() yet
// All cases use the same validation (which is the default behavior)

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
  });

  return data => {
    return dataType.parse(data);
  };
});

createCase('dhi', 'parseStrict', () => {
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

createCase('dhi', 'assertLoose', () => {
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
    dataType.parse(data);
    return true;
  };
});

createCase('dhi', 'assertStrict', () => {
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
    dataType.parse(data);
    return true;
  };
});
