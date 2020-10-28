import { number, record, string, boolean, asserts } from 'narrows';
import { Case } from './abstract';

const dataType = asserts(
  record({
    number: number,
    negNumber: number,
    maxNumber: number,
    string: string,
    longString: string,
    boolean: boolean,
    deeplyNested: record({
      foo: string,
      num: number,
      bool: boolean,
    }),
  })
);

export class NarrowsCase extends Case implements Case {
  name = 'narrows';

  validate() {
    dataType(this.data);

    return this.data;
  }
}
