import myzod from 'myzod';
import { createCase } from '../benchmarks';

createCase('myzod', 'validateStrict', () => {
  const dataType = myzod.object({
    number: myzod.number(),
    negNumber: myzod.number(),
    maxNumber: myzod.number(),
    string: myzod.string(),
    longString: myzod.string(),
    boolean: myzod.boolean(),
    deeplyNested: myzod.object({
      foo: myzod.string(),
      num: myzod.number(),
      bool: myzod.boolean(),
    }),
  });

  return data => {
    return dataType.parse(data);
  };
});

createCase('myzod', 'validate', () => {
  const dataType = myzod.object(
    {
      number: myzod.number(),
      negNumber: myzod.number(),
      maxNumber: myzod.number(),
      string: myzod.string(),
      longString: myzod.string(),
      boolean: myzod.boolean(),
      deeplyNested: myzod.object(
        {
          foo: myzod.string(),
          num: myzod.number(),
          bool: myzod.boolean(),
        },
        {
          allowUnknown: true,
        }
      ),
    },
    {
      allowUnknown: true,
    }
  );

  return data => {
    return dataType.parse(data);
  };
});
