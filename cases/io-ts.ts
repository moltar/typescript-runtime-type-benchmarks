import * as t from 'io-ts'
import { isRight } from 'fp-ts/lib/Either'
import { Data } from '../data'

export interface NonEmptyStringBrand {
  readonly NonEmptyString: unique symbol
}

export type NonEmptyString = t.Branded<string, NonEmptyStringBrand>

export interface NonEmptyStringC extends t.Type<NonEmptyString, string, unknown> { }

export const LongString: NonEmptyStringC = t.brand(
  t.string,
  (s): s is NonEmptyString => s.length > 100,
  'NonEmptyString'
)

export interface NegIntBrand {
  readonly NegInt: unique symbol
}

export type NegInt = t.Branded<number, NegIntBrand>

export interface NegIntC extends t.Type<NegInt, number, unknown> { }

export const NegInt: NegIntC = t.brand(
  t.number,
  (n): n is NegInt => n < 0,
  'NegInt'
)

const DataType = t.type({
  number: t.Int,
  neg_number: NegInt,
  max_number: t.number,
  string: t.string,
  long_string: LongString,
  boolean: t.boolean,
  deeplyNested: t.type({
    foo: t.string,
    num: t.number,
    bool: t.boolean
  })
})

export function caseIoTs(data: Data) {
  if (isRight(DataType.decode(data))) {
    return data
  }

  throw new Error('Invalid')
}
