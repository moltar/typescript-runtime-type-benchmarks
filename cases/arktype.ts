import { type } from 'arktype';
import { createCase } from '../benchmarks';

const t = type({
  number: 'number',
  negNumber: 'number',
  maxNumber: 'number',
  string: 'string',
  longString: 'string',
  boolean: 'boolean',
  deeplyNested: {
    foo: 'string',
    num: 'number',
    bool: 'boolean',
  },
});

const tStrict = t.onDeepUndeclaredKey('reject');

createCase('arktype', 'assertLoose', () => {
  return data => {
    if (t.allows(data)) return true;
    throw new Error('Invalid');
  };
});

createCase('arktype', 'assertStrict', () => {
  return data => {
    if (tStrict.allows(data)) return true;
    throw new Error('Invalid');
  };
});

createCase('arktype', 'parseStrict', () => {
  return data => {
    const out = tStrict(data);

    if (out instanceof type.errors) throw new Error('Invalid');

    return out;
  };
});
