import * as t from 'io-ts';
import { Case } from './abstract';

const dataType = t.type({
  number: t.Int,
  negNumber: t.number,
  maxNumber: t.number,
  string: t.string,
  longString: t.string,
  boolean: t.boolean,
  deeplyNested: t.type({
    foo: t.string,
    num: t.number,
    bool: t.boolean,
  }),
});

export class IoTsCase extends Case implements Case {
  name = 'io-ts';

  validate() {
    const { data } = this

    if (dataType.is(data)) {
      return data;
    }

    throw new Error('Invalid');
  }
}
