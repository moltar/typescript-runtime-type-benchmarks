import { createCase } from '../benchmarks';
import {
  object,
  objectCompiled,
  objectGuard,
  objectGuardCompiled,
  parseString,
  parseNumber,
  parseBoolean,
  type Parser,
  isNumber,
  isString,
  isBoolean,
  objectStrict,
  objectStrictCompiled,
} from 'pure-parse';

/**
 * Given a PureParse parser, return a new parser that throws an error if parsing fails, and returns the value if parsing succeeds.
 * @param parse
 * @returns a parser that is compatible with `createCase`
 */
const tryParse =
  <T>(parse: Parser<T>) =>
  (data: unknown): T => {
    const res = parse(data);
    if (res.tag === 'failure') {
      throw new Error('parsing failed');
    } else {
      return res.value;
    }
  };

createCase('pure-parse (JIT compiled)', 'parseSafe', () =>
  tryParse(
    objectCompiled({
      number: parseNumber,
      negNumber: parseNumber,
      maxNumber: parseNumber,
      string: parseString,
      longString: parseString,
      boolean: parseBoolean,
      deeplyNested: objectCompiled({
        foo: parseString,
        num: parseNumber,
        bool: parseBoolean,
      }),
    }),
  ),
);

createCase('pure-parse', 'parseSafe', () =>
  tryParse(
    object({
      number: parseNumber,
      negNumber: parseNumber,
      maxNumber: parseNumber,
      string: parseString,
      longString: parseString,
      boolean: parseBoolean,
      deeplyNested: object({
        foo: parseString,
        num: parseNumber,
        bool: parseBoolean,
      }),
    }),
  ),
);

createCase('pure-parse', 'parseStrict', () =>
  tryParse(
    objectStrict({
      number: parseNumber,
      negNumber: parseNumber,
      maxNumber: parseNumber,
      string: parseString,
      longString: parseString,
      boolean: parseBoolean,
      deeplyNested: objectStrict({
        foo: parseString,
        num: parseNumber,
        bool: parseBoolean,
      }),
    }),
  ),
);

createCase('pure-parse (JIT compiled)', 'parseStrict', () =>
  tryParse(
    objectStrictCompiled({
      number: parseNumber,
      negNumber: parseNumber,
      maxNumber: parseNumber,
      string: parseString,
      longString: parseString,
      boolean: parseBoolean,
      deeplyNested: objectStrictCompiled({
        foo: parseString,
        num: parseNumber,
        bool: parseBoolean,
      }),
    }),
  ),
);

createCase('pure-parse (JIT compiled)', 'assertLoose', () =>
  objectGuardCompiled({
    number: isNumber,
    negNumber: isNumber,
    maxNumber: isNumber,
    string: isString,
    longString: isString,
    boolean: isBoolean,
    deeplyNested: objectGuardCompiled({
      foo: isString,
      num: isNumber,
      bool: isBoolean,
    }),
  }),
);

createCase('pure-parse', 'assertLoose', () =>
  objectGuard({
    number: isNumber,
    negNumber: isNumber,
    maxNumber: isNumber,
    string: isString,
    longString: isString,
    boolean: isBoolean,
    deeplyNested: objectGuard({
      foo: isString,
      num: isNumber,
      bool: isBoolean,
    }),
  }),
);
