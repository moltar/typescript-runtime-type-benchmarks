import {
  object,
  number,
  boolean,
  string,
} from '@ailabs/ts-utils/dist/decoder.js';
import { createCase } from '../benchmarks/index.ts';

createCase('ts-utils', 'parseSafe', () => {
  const dataType = object('Data', {
    number,
    negNumber: number,
    maxNumber: number,
    string,
    longString: string,
    boolean,
    deeplyNested: object('DeeplyNested', {
      foo: string,
      num: number,
      bool: boolean,
    }),
  });

  return data => {
    const res = dataType(data);

    if (res.error()) {
      throw res.error();
    }

    return res.toMaybe().value();
  };
});
