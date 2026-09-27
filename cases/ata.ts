import { Validator } from 'ata-validator';
import { createCase } from '../benchmarks';

// The properties are listed in reverse. Declared in the same order as the
// test data, the schema's `properties` objects get the same V8 hidden class as
// the data objects, and because the schema stores objects in fields where the
// data stores numbers and strings, V8 generalizes those fields for every
// object of that class, the test data included. That slows everything that
// reads the data in this process, not only the validator: the ata-(ahead-of-
// time) validator, which checks the same data without any schema object, drops
// by about a fifth when this literal merely exists beside it. The order does
// not change what the schema accepts.
const looseSchema = {
  type: 'object',
  properties: {
    deeplyNested: {
      type: 'object',
      properties: {
        bool: { type: 'boolean' },
        num: { type: 'number' },
        foo: { type: 'string' },
      },
      required: ['foo', 'num', 'bool'],
    },
    boolean: { type: 'boolean' },
    longString: { type: 'string' },
    string: { type: 'string' },
    maxNumber: { type: 'number' },
    negNumber: { type: 'number' },
    number: { type: 'number' },
  },
  required: [
    'number',
    'negNumber',
    'maxNumber',
    'string',
    'longString',
    'boolean',
    'deeplyNested',
  ],
} as const;

createCase('ata', 'assertLoose', () => {
  const v = new Validator(looseSchema);

  return data => {
    const result = v.validate(data);

    if (!result.valid) {
      throw new Error(JSON.stringify(result.errors));
    }

    return true;
  };
});

createCase('ata', 'assertStrict', () => {
  const strictSchema = JSON.parse(JSON.stringify(looseSchema));
  strictSchema.additionalProperties = false;
  strictSchema.properties.deeplyNested.additionalProperties = false;

  const v = new Validator(strictSchema);

  return data => {
    const result = v.validate(data);

    if (!result.valid) {
      throw new Error(JSON.stringify(result.errors));
    }

    return true;
  };
});

createCase('ata', 'parseSafe', () => {
  // parse() validates and returns a copy holding only the properties the
  // schema declares, which is what this benchmark asks for; it throws on an
  // invalid value. The copy is built from the schema's key list, so unknown
  // keys are dropped without being enumerated, and the input is left alone.
  const v = new Validator(looseSchema);

  return data => v.parse(data);
});

createCase('ata', 'parseStrict', () => {
  const schema = JSON.parse(JSON.stringify(looseSchema));
  schema.additionalProperties = false;
  schema.properties.deeplyNested.additionalProperties = false;

  const v = new Validator(schema);

  return data => {
    const result = v.validate(data);

    if (!result.valid) {
      throw new Error(JSON.stringify(result.errors));
    }

    return data;
  };
});
