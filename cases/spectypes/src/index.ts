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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseStrict: any = object({
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const parseSafe: any = struct({
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const assertLoose: any = merge(
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
      UNSAFE_record(unknown),
    ),
  }),
  UNSAFE_record(unknown),
);
