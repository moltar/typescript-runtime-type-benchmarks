import {
  object,
  string,
  number,
  boolean,
  assert,
  type,
  mask,
  validate,
  create,
} from 'superstruct';
import { createCase } from '../benchmarks';

createCase(
  'superstruct',
  'validate',
  () => {
    const dataType = type({
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

    return data => {
      assert(data, dataType);

      return mask(data, dataType);
    };
  },
  // can't get the `mask` stuff to work - its documented to remove any
  // additional attributes that `type` ignored
  { disabled: true }
);

createCase('superstruct', 'validateLoose', () => {
  const dataType = type({
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

  return data => {
    assert(data, dataType);

    return data;
  };
});

createCase('superstruct', 'validateStrict', () => {
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
    assert(data, dataType);

    return data;
  };
});
