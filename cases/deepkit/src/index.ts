import { castFunction, getValidatorFunction } from '@deepkit/type';

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

const isToBeChecked = getValidatorFunction<ToBeChecked>();
const safeToBeChecked = castFunction<ToBeChecked>();

/**
 * Check that an object conforms to the schema.
 *
 * Ignore any extra keys in input objects.
 *
 * Such a validation mode is highly unsafe when used on untrusted input.
 *
 * But not checking for unknown/extra keys in records may provide massive
 * speedups and may suffice in certain scenarios.
 */
export function assertLoose(input: unknown): boolean {
  if (!isToBeChecked(input) as boolean) throw new Error('wrong type.');
  return true;
}

/**
 * Check that an object conforms to the schema.
 *
 * Raise errors if any extra keys not present in the schema are found.
 */
export function assertStrict(input: unknown): boolean {
  throw new Error('not supported.');
}

/**
 * Like parseSafe but throw on unknown (extra) keys in objects.
 */
export function parseStrict(input: unknown): ToBeChecked {
  throw new Error('not supported.');
}

/**
 * Validate and ignore unknown keys, removing them from the result.
 *
 * When validating untrusted data, unknown keys should always be removed to
 * not result in unwanted parameters or the `__proto__` attribute being
 * maliciously passed to internal functions.
 */
export function parseSafe(input: unknown): ToBeChecked {
  if (!isToBeChecked(input) as boolean) throw new Error('wrong type.');
  return safeToBeChecked(input);
}
