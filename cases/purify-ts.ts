import { Codec, string, number, boolean } from 'purify-ts/Codec';
import { Left, Right } from 'purify-ts/Either';
import { Case } from './abstract';

type LongString = string & {__brand: 'LongString'}

const LongString = Codec.custom<LongString>({
  decode: x => string.decode(x).chain(s => s.length > 100 ? Right(s as LongString) : Left("String must have minimum length of 100")),
  encode: string.encode
});

type NegInt = number & {__brand: 'NegInt'}

const NegInt = Codec.custom<NegInt>({
  decode: x => number.decode(x).chain(n => (n < 0 ? Right(n as NegInt) : Left("Number must be negative"))),
  encode: number.encode
});

const DataType = Codec.interface({
  number: number,
  negNumber: NegInt,
  maxNumber: number,
  string: string,
  longString: LongString,
  boolean: boolean,
  deeplyNested: Codec.interface({
    foo: string,
    num: number,
    bool: boolean
  })
});

export class PurifyTsCase extends Case implements Case {
  name = "purify-ts";

  validate() {
    if (DataType.decode(this.data).isRight()) {
      return this.data;
    }

    throw new Error("Invalid");
  }
}
