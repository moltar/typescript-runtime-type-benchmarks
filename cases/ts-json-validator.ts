import { createSchema as S, TsjsonParser } from 'ts-json-validator';
import { Case } from './abstract';

const parser = new TsjsonParser(
  S({
    type: 'object',
    required: [
      'boolean',
      'deeplyNested',
      'longString',
      'maxNumber',
      'negNumber',
      'number',
      'string',
    ],
    properties: {
      number: S({ type: 'number' }),
      negNumber: S({ type: 'number' }),
      maxNumber: S({ type: 'number' }),
      string: S({ type: 'string' }),
      longString: S({ type: 'string' }),
      boolean: S({ type: 'boolean' }),
      deeplyNested: S({
        type: 'object',
        required: ['foo', 'bool', 'num'],
        properties: {
          foo: S({ type: 'string' }),
          num: S({ type: 'number' }),
          bool: S({ type: 'boolean' }),
        },
      }),
    },
  })
);

export class TsJsonValidatorCase extends Case implements Case {
  name = 'ts-json-validator';

  validate() {
    const { data } = this;

    if (parser.validates(data)) {
      return data;
    }

    throw new Error('Invalid');
  }
}
