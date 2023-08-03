import * as v from 'valibot';
import { createCase } from '../benchmarks';

createCase('valibot', 'parseSafe', () => {
  const dataType = v.object({
    number: v.number(),
    negNumber: v.number(),
    maxNumber: v.number(),
    string: v.string(),
    longString: v.string(),
    boolean: v.boolean(),
    deeplyNested: v.object({
      foo: v.string(),
      num: v.number(),
      bool: v.boolean(),
    }),
  });

  return data => {
    return dataType.parse(data);
  };
});

createCase('valibot', 'parseStrict', () => {
  const dataType = v.strict(v
    .object({
      number: v.number(),
      negNumber: v.number(),
      maxNumber: v.number(),
      string: v.string(),
      longString: v.string(),
      boolean: v.boolean(),
      deeplyNested: v.strict(v
        .object({
          foo: v.string(),
          num: v.number(),
          bool: v.boolean(),
        }))
    }))

  return data => {
    return v.safeParse(dataType, data)
  };
});

