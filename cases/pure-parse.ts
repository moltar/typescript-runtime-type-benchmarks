import { createCase } from '../benchmarks';
import {
  object,
  objectNoJit,
  objectGuard,
  objectGuardNoJit,
  parseString,
  parseNumber,
  parseBoolean,
  Parser,
  isNumber,
  isString,
  isBoolean,
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

createCase('pure-parse-(JIT)', 'parseSafe', () =>
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
    })
  )
);

createCase('pure-parse-(dynamic)', 'parseSafe', () =>
  tryParse(
    objectNoJit({
      number: parseNumber,
      negNumber: parseNumber,
      maxNumber: parseNumber,
      string: parseString,
      longString: parseString,
      boolean: parseBoolean,
      deeplyNested: objectNoJit({
        foo: parseString,
        num: parseNumber,
        bool: parseBoolean,
      }),
    })
  )
);

createCase('pure-parse-(JIT)', 'assertLoose', () =>
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
  })
);

createCase('pure-parse-(dynamic)', 'assertLoose', () =>
  objectGuardNoJit({
    number: isNumber,
    negNumber: isNumber,
    maxNumber: isNumber,
    string: isString,
    longString: isString,
    boolean: isBoolean,
    deeplyNested: objectGuardNoJit({
      foo: isString,
      num: isNumber,
      bool: isBoolean,
    }),
  })
);
