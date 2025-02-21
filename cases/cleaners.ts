import { asBoolean, asNumber, asObject, asString } from 'cleaners';
import { createCase } from '../benchmarks';

const asT = asObject({
  number: asNumber,
  negNumber: asNumber,
  maxNumber: asNumber,
  string: asString,
  longString: asString,
  boolean: asBoolean,
  deeplyNested: asObject({
    foo: asString,
    num: asNumber,
    bool: asBoolean,
  }),
});

createCase('cleaners', 'assertLoose', () => {
  return data => {
    if (asT(data)) return true;
    throw new Error('Invalid');
  };
});
