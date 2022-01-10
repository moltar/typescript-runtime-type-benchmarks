import Ajv from 'ajv';
import { createCase } from '../benchmarks';

createCase('ajv', 'assertLoose', () => {
  const ajv = new Ajv();
  const schema = {
    $id: 'AjvTest',
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
      number: {
        type: 'number',
      },
      negNumber: {
        type: 'number',
      },
      maxNumber: {
        type: 'number',
      },
      string: {
        type: 'string',
      },
      longString: {
        type: 'string',
      },
      boolean: {
        type: 'boolean',
      },
      deeplyNested: {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
          },
          num: {
            type: 'number',
          },
          bool: {
            type: 'boolean',
          },
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
  };
  const validate = ajv.compile(schema);

  return data => {
    if (!validate(data)) {
      throw new Error(JSON.stringify(ajv.errors, null, 4));
    }

    return true;
  };
});

createCase('ajv', 'assertStrict', () => {
  const ajv = new Ajv();
  const schema = {
    $id: 'AjvTest',
    $schema: 'http://json-schema.org/draft-07/schema#',
    type: 'object',
    properties: {
      number: {
        type: 'number',
      },
      negNumber: {
        type: 'number',
      },
      maxNumber: {
        type: 'number',
      },
      string: {
        type: 'string',
      },
      longString: {
        type: 'string',
      },
      boolean: {
        type: 'boolean',
      },
      deeplyNested: {
        type: 'object',
        properties: {
          foo: {
            type: 'string',
          },
          num: {
            type: 'number',
          },
          bool: {
            type: 'boolean',
          },
        },
        required: ['foo', 'num', 'bool'],
        additionalProperties: false,
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
    additionalProperties: false,
  };
  const validate = ajv.compile(schema);

  return data => {
    if (!validate(data)) {
      throw new Error(JSON.stringify(ajv.errors, null, 4));
    }

    return true;
  };
});
