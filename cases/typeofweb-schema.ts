import { object, number, string, validate, boolean } from '@typeofweb/schema';
import { createCase } from '../benchmarks';

createCase('@typeofweb/schema', 'assertLoose', () => {
  const dataType = object(
    {
      number: number(),
      negNumber: number(),
      maxNumber: number(),
      string: string(),
      longString: string(),
      boolean: boolean(),
      deeplyNested: object(
        {
          foo: string(),
          num: number(),
          bool: boolean(),
        },
        { allowUnknownKeys: true }
      )(),
    },
    { allowUnknownKeys: true }
  )();

  const validator = validate(dataType);

  return data => {
    validator(data);

    return true;
  };
});

createCase('@typeofweb/schema', 'parseStrict', () => {
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
    })(),
  })();

  const validator = validate(dataType);

  return data => {
    return validator(data);
  };
});
