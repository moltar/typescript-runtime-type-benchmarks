import {
  object,
  number,
  string,
  boolean,
  struct,
  merge,
  UNSAFE_record,
  unknown,
} from 'spectypes';

export const parseStrict = object({
  number,
  negNumber: number,
  maxNumber: number,
  string,
  longString: string,
  boolean,
  deeplyNested: object({
    foo: string,
    num: number,
    bool: boolean,
  }),
});

export const parseSafe = struct({
  number,
  negNumber: number,
  maxNumber: number,
  string,
  longString: string,
  boolean,
  deeplyNested: struct({
    foo: string,
    num: number,
    bool: boolean,
  }),
});

export const assertLoose = merge(
  object({
    number,
    negNumber: number,
    maxNumber: number,
    string,
    longString: string,
    boolean,
    deeplyNested: merge(
      object({
        foo: string,
        num: number,
        bool: boolean,
      }),
      UNSAFE_record(unknown)
    ),
  }),
  UNSAFE_record(unknown)
);
