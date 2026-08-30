import { Validator } from 'ata-validator';
import { createCase } from '../benchmarks';

const looseSchema = {
  type: 'object',
  properties: {
    number: { type: 'number' },
    negNumber: { type: 'number' },
    maxNumber: { type: 'number' },
    string: { type: 'string' },
    longString: { type: 'string' },
    boolean: { type: 'boolean' },
    deeplyNested: {
      type: 'object',
      properties: {
        foo: { type: 'string' },
        num: { type: 'number' },
        bool: { type: 'boolean' },
      },
      required: ['foo', 'num', 'bool'],
    },
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
  const v = new Validator(looseSchema as never);

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
