import { boolean, number, object, string, assert } from 'ok-computer';
import { type UnknownData, addCase } from '../benchmarks/index.ts';

const dataType = object({
  number: number,
  negNumber: number,
  maxNumber: number,
  string: string,
  longString: string,
  boolean: boolean,
  deeplyNested: object({
    foo: string,
    num: number,
    bool: boolean,
  }),
});

const dataTypeLoose = object(
  {
    number: number,
    negNumber: number,
    maxNumber: number,
    string: string,
    longString: string,
    boolean: boolean,
    deeplyNested: object(
      {
        foo: string,
        num: number,
        bool: boolean,
      },
      { allowUnknown: true },
    ),
  },
  { allowUnknown: true },
);

addCase('ok-computer', 'assertStrict', (data: UnknownData) => {
  assert(dataType(data));
  return true;
});

addCase('ok-computer', 'assertLoose', (data: UnknownData) => {
  assert(dataTypeLoose(data));
  return true;
});
