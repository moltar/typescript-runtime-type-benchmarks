import { createSchema, _ } from 'tiny-schema-validator';
import { createCase } from '../benchmarks/index.ts';

// Define the Strict schema with additional property constraints
export const Strict = createSchema({
  number: _.number(),
  negNumber: _.number(),
  maxNumber: _.number(),
  string: _.string(),
  longString: _.string(),
  boolean: _.boolean(),
  deeplyNested: _.record({
    foo: _.string(),
    num: _.number(),
    bool: _.boolean(),
  }),
});

createCase('tiny-schema-validator', 'assertStrict', () => {
  return data => {
    if (!Strict.is(data)) {
      throw new Error('validation failure');
    }
    return true;
  };
});

createCase('tiny-schema-validator', 'parseStrict', () => {
  return data => {
    return Strict.produce(data);
  };
});
