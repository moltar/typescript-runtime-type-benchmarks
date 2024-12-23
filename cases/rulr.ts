// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import * as pkg from 'rulr';
const { object, number, string, boolean } = pkg;

import { createCase } from '../benchmarks/index.ts';

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
