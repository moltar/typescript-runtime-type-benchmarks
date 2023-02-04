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

export const parseSafe = typia.createIs<ToBeChecked>();
export const parseStrict = typia.createEquals<ToBeChecked>();
export const assertStrict = typia.createAssertEquals<ToBeChecked>();
export const assertLoose = typia.createAssert<ToBeChecked>();
