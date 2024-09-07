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

createCase('arktype', 'assertLoose', () => {
  return data => {
    if (t.allows(data)) return true;
    throw new Error('Invalid');
  };
});
