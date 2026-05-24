import {
  object,
  string,
  number,
  boolean,
  parse,
  check,
  strict,
  settings,
} from '@sx3/gate';
import { createCase } from '../benchmarks';

settings({ checkNaN: false });

const schema = object({
  number: number,
  negNumber: number,
  maxNumber: number,
  string: string,
  longString: string,
  boolean: boolean,
  deeplyNested: object({
    foo: string,
    num: number,
    bool: boolean,
  }),
});

createCase('@sx3/gate', 'parseSafe', () => parse(schema));

createCase('@sx3/gate', 'parseStrict', () => parse(strict(schema, true)));

createCase('@sx3/gate', 'assertLoose', () => {
  const assert = check(schema);
  return data => {
    if (assert(data)) return true;
    throw new Error('Invalid');
  };
});

createCase('@sx3/gate', 'assertStrict', () => {
  const assert = check(strict(schema, true));
  return data => {
    if (assert(data)) return true;
    throw new Error('Invalid');
  };
});
