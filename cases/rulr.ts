import { object, number, string, boolean } from 'rulr';
import { createCase } from '../benchmarks';

createCase('rulr', 'parseSafe', () => {
  const dataType = object({
    bail: true,
    required: {
      number,
      negNumber: number,
      maxNumber: number,
      string,
      longString: string,
      boolean: boolean,
      deeplyNested: object({
        bail: true,
        required: {
          foo: string,
          num: number,
          bool: boolean,
        },
      }),
    },
  });

  return data => {
    return dataType(data);
  };
});
