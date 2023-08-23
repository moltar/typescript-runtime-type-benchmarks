import { object, number, string, boolean, parse, strict } from 'valibot';
import { createCase } from '../benchmarks';

createCase('valibot', 'parseSafe', () => {
  const dataType = object({
    number: number(),
    negNumber: number(),
    maxNumber: number(),
    string: string(),
    longString: string(),
    boolean: boolean(),
    deeplyNested: object({
      foo: string(),
      num: number(),
      bool: boolean(),
    }),
  });

  return data => {
    return parse(dataType, data);
  };
});

createCase('valibot', 'parseStrict', () => {
  const dataType = strict(
    object({
      number: number(),
      negNumber: number(),
      maxNumber: number(),
      string: string(),
      longString: string(),
      boolean: boolean(),
      deeplyNested: strict(
        object({
          foo: string(),
          num: number(),
          bool: boolean(),
        })
      ),
    })
  );

  return data => {
    return parse(dataType, data);
  };
});
