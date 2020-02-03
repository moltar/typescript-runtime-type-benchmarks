import * as t from 'io-ts'
import { isRight } from 'fp-ts/lib/Either'
import { Case } from './abstract'

interface NonEmptyStringBrand {
  readonly NonEmptyString: unique symbol
}

type NonEmptyString = t.Branded<string, NonEmptyStringBrand>

interface NonEmptyStringC extends t.Type<NonEmptyString, string, unknown> { }

const LongString: NonEmptyStringC = t.brand(
  t.string,
  (s): s is NonEmptyString => s.length > 100,
  'NonEmptyString'
)

interface NegIntBrand {
  readonly NegInt: unique symbol
}

type NegInt = t.Branded<number, NegIntBrand>

interface NegIntC extends t.Type<NegInt, number, unknown> { }

const NegInt: NegIntC = t.brand(
  t.number,
  (n): n is NegInt => n < 0,
  'NegInt'
)

const DataType = t.type({
  number: t.Int,
  negNumber: NegInt,
  maxNumber: t.number,
  string: t.string,
  longString: LongString,
  boolean: t.boolean,
  deeplyNested: t.type({
    foo: t.string,
    num: t.number,
    bool: t.boolean
  })
})

export class IoTsCase extends Case implements Case {
  name = 'io-ts'

  validate() {
    if (isRight(DataType.decode(this.data))) {
      return this.data
    }

    throw new Error('Invalid')
  }
}