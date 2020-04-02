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
    bool: boolean,
  }),
});

export class PurifyCase extends Case implements Case {
  name = 'purify-ts';

  validate() {
    const decodedData = dataType.decode(this.data);

    if (decodedData.isRight()) {
      return decodedData.extract();
    }

    throw new Error('Invalid');
  }
}
