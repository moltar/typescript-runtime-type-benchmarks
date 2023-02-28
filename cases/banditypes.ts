import { boolean, number, object, string } from 'banditypes';
import { addCase } from '../benchmarks';

const dataTypeSafe = object({
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

addCase('banditypes', 'parseSafe', data => {
  return dataTypeSafe(data);
});

addCase('banditypes', 'assertLoose', data => {
  dataTypeSafe(data);

  return true;
});
