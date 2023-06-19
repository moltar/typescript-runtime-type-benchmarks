import {
  guard,
  is,
  $boolean,
  $Exact,
  $interface,
  $number,
  $string,
} from 'succulent';
import { createCase } from '../benchmarks';

const $LooseType = $interface({
  number: $number,
  negNumber: $number,
  maxNumber: $number,
  string: $string,
  longString: $string,
  boolean: $boolean,
  deeplyNested: $interface({
    foo: $string,
    num: $number,
    bool: $boolean,
  }),
});

const $StrictType = $Exact({
  number: $number,
  negNumber: $number,
  maxNumber: $number,
  string: $string,
  longString: $string,
  boolean: $boolean,
  deeplyNested: $Exact({
    foo: $string,
    num: $number,
    bool: $boolean,
  }),
});

createCase('succulent', 'parseStrict', () => {
  return data => {
    const ok = is(data, $StrictType);
    if (!ok) {
      throw new Error('invalid data');
    }

    return data;
  };
});

createCase('succulent', 'assertLoose', () => {
  return data => {
    guard(data, $LooseType);

    return true;
  };
});

createCase('succulent', 'assertStrict', () => {
  return data => {
    guard(data, $StrictType);

    return true;
  };
});
