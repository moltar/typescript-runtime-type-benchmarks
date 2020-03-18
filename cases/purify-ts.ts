import { Codec, string, number, boolean } from 'purify-ts/Codec';
import { Case } from './abstract';

const dataType = Codec.interface({
  number,
  negNumber: number,
  maxNumber: number,
  string,
  longString: string,
  boolean,
  deeplyNested: Codec.interface({
    foo: string,
    num: number,
    bool: boolean
  })
});

export class PurifyCase extends Case implements Case {
  name = 'purify-ts';

  validate() {
    const { data } = this

    if (dataType.decode(data).isRight()) {
      return data;
    }

    throw new Error("Invalid");
  }
}
