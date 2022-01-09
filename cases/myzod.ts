import myzod from 'myzod';
import { addCase, createCase } from '../benchmarks';

createCase('myzod', 'parseSafe', () => {
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

const dataTypeStrict = myzod.object({
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

addCase('myzod', 'parseStrict', data => {
  return dataTypeStrict.parse(data);
});

addCase('myzod', 'assertStrict', data => {
  dataTypeStrict.parse(data);

  return true;
});
