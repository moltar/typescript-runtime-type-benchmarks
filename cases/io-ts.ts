import * as t from 'io-ts';
import { pipe } from 'fp-ts/function';
import { fold } from 'fp-ts/Either';
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
    return pipe(
      dataType.decode(this.data),
      fold(
        errors => {
          throw errors;
        },
        a => a
      )
    );
  }
}
