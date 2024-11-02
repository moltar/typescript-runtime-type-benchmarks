import { validate } from '@aeriajs/validation';
import { createCase } from '../../benchmarks';

const schema = {
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
} as const;

createCase('aeria', 'parseSafe', () => {
  return (data: unknown) => {
    return validate(data, schema, {
      throwOnError: true,
      tolerateExtraneous: true,
    }).result;
  };
});

createCase('aeria', 'parseStrict', () => {
  return (data: unknown) => {
    return validate(data, schema, {
      throwOnError: true,
    }).result;
  };
});

createCase('aeria', 'assertLoose', () => {
  return (data: unknown) => {
    validate(data, schema, {
      throwOnError: true,
      tolerateExtraneous: true,
    });

    return true;
  };
});

createCase('aeria', 'assertStrict', () => {
  return (data: unknown) => {
    validate(data, schema, {
      throwOnError: true,
    });

    return true;
  };
});
