import type { Assert } from 'ts-runtime-checks';

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const assertLoose = (_value: Assert<ToBeChecked>) => true;
