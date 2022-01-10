import {
  assert,
  boolean,
  mask,
  number,
  object,
  string,
  type,
} from 'superstruct';
import { addCase } from '../benchmarks';

const dataTypeSafe = type({
  number: number(),
  negNumber: number(),
  maxNumber: number(),
  string: string(),
  longString: string(),
  boolean: boolean(),
  deeplyNested: type({
    foo: string(),
    num: number(),
    bool: boolean(),
  }),
});

const dataTypeStrict = object({
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

addCase(
  'superstruct',
  'parseSafe',
  data => {
    assert(data, dataTypeSafe);

    return mask(data, dataTypeSafe);
  },
  // can't get the `mask` stuff to work - its documented to remove any
  // additional attributes that `type` ignored
  { disabled: true }
);

addCase('superstruct', 'parseStrict', data => {
  assert(data, dataTypeStrict);

  return data;
});

addCase('superstruct', 'assertLoose', data => {
  assert(data, dataTypeSafe);

  return true;
});

addCase('superstruct', 'assertStrict', data => {
  assert(data, dataTypeStrict);

  return true;
});
