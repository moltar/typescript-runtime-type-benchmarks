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

const is = typia.createIs<ToBeChecked>();
const equals = typia.createEquals<ToBeChecked>();

export function assertLoose(input: unknown): boolean {
  if (!is(input)) throw new Error('wrong type.');
  return true;
}

export function assertStrict(input: unknown): boolean {
  if (!equals(input)) throw new Error('wrong type.');
  return true;
}

export function parseStrict(input: unknown): ToBeChecked {
  if (!equals(input)) throw new Error('wrong type.');
  return input;
}

export function parseSafe(input: unknown): ToBeChecked {
  if (!is(input)) throw new Error('wrong type.');
  typia.prune(input);
  return input;
}
