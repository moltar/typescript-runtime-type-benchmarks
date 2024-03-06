import { createCase } from '../benchmarks';

/*
 * This import was switched to a require() because otherwise
 * ts compiler would reach node_modules/@aeriajs/**, and compilation
 * would fail because aeria uses a newer Typescript version
 */
const { silentValidator } = require('@aeriajs/validation');

const schema = <const>{
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

createCase('aeria', 'parseSafe', () => {
  const [_, validate] = silentValidator(schema, {
    extraneous: true,
    filterOutExtraneous: true,
    coerce: true,
  });

  return (data: any) => {
    const result = validate(data);
    if (!result) {
      throw new Error();
    }

    return result;
  };
});

createCase('aeria', 'parseStrict', () => {
  const [_, validate] = silentValidator(schema, {
    coerce: true,
  });

  return (data: any) => {
    const result = validate(data);
    if (!result) {
      throw new Error();
    }

    return result;
  };
});

createCase('aeria', 'assertLoose', () => {
  const [_, validate] = silentValidator(schema, {
    extraneous: true,
  });

  return (data: any) => {
    if (!validate(data)) {
      throw new Error();
    }

    return true;
  };
});

createCase('aeria', 'assertStrict', () => {
  const [_, validate] = silentValidator(schema);

  return (data: any) => {
    if (!validate(data)) {
      throw new Error();
    }

    return true;
  };
});
