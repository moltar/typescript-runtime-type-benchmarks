import {
  string,
  number,
  object,
  boolean,
} from '@mojotech/json-type-validation';
import { createCase } from '../benchmarks';

createCase('@mojotech/json-type-validation', 'parseSafe', () => {
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
    return dataType.runWithException(data);
  };
});
