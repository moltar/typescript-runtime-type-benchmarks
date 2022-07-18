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

export const assertLoose = (value: Assert<ToBeChecked>) => true;
