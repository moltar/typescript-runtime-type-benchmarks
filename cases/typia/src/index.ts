import typia from 'typia';

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

export const is = typia.createIs<ToBeChecked>();
export const equals = typia.createEquals<ToBeChecked>();
export const clone = typia.misc.createClone<ToBeChecked>();
