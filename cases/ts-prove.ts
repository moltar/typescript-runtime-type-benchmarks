import P, { isProved } from 'ts-prove';
import { Case } from './abstract';

const proveData = P.shape({
  number: P.number,
  negNumber: P.number,
  maxNumber: P.number,
  string: P.string,
  longString: P.string,
  boolean: P.boolean,
  deeplyNested: P.shape({
    foo: P.string,
    num: P.number,
    bool: P.boolean,
  }),
});

export class TsProveCase extends Case implements Case {
  name = 'ts-prove';

  validate() {
    const { data } = this;
    const res = proveData(data);

    if (isProved(res)) {
      return data;
    }
  }
}
