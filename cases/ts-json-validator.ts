import { createSchema as S, TsjsonParser } from 'ts-json-validator'
import { Data } from '../data'

const parser = new TsjsonParser(
  S({
    type: 'object',
    properties: {
      number: S({ type: 'number' }),
      neg_number: S({ type: 'number', maximum: 0 }),
      max_number: S({ type: 'number' }),
      string: S({ type: 'string' }),
      long_string: S({ type: 'string', minLength: 100 }),
      boolean: S({ type: 'boolean' }),
      deeplyNested: S({
        type: 'object',
        properties: {
          foo: S({ type: 'string' }),
          num: S({ type: 'number' }),
          bool: S({ type: 'boolean' })
        }
      })
    },
  })
)

export function caseTsJsonValidator(data: Data) {
  if (parser.validates(data)) {
    return data
  }
  throw new Error('Invalid')
}
