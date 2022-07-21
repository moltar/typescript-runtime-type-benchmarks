import type { Assert, ExactProps } from 'ts-runtime-checks';

interface ToBeChecked {
  number: number;
  negNumber: number;
  maxNumber: number;
  string: string;
  longString: string;
  boolean: boolean;
  deeplyNested: {
    foo: string;
    num: number;
    bool: boolean;
  };
}

export const parseStrict = (value: Assert<ExactProps<ToBeChecked>>) => value;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const assertStrict = (_value: Assert<ExactProps<ToBeChecked>>) => true;

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const assertLoose = (_value: Assert<ToBeChecked>) => true;
