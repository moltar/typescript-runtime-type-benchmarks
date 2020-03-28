import { objectDecoder, stringDecoder, numberDecoder, boolDecoder } from 'json-decoder';
import { Case } from './abstract';

const dataType = objectDecoder({
  number: numberDecoder,
  negNumber: numberDecoder,
  maxNumber: numberDecoder,
  string: stringDecoder,
  longString: stringDecoder,
  boolean: boolDecoder,
  deeplyNested: objectDecoder({
    foo: stringDecoder,
    num: numberDecoder,
    bool: boolDecoder,
  }),
});

export class JsonDecoderCase extends Case implements Case {
  name = 'json-decoder';

  validate() {
    const res = dataType.decode(this.data);

    if (res.type === 'ERR') {
      throw new Error(res.message)
    }

    return res.value
  }
}
