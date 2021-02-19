import { object, number, string, boolean } from 'rulr';
import { Case } from './abstract';

const dataType = object({
  bail: true,
  required: {
    number,
    negNumber: number,
    maxNumber: number,
    string,
    longString: string,
    boolean: boolean,
    deeplyNested: object({
      bail: true,
      required: {
        foo: string,
        num: number,
        bool: boolean,
      },
    }),
  },
});

export class RulrCase extends Case implements Case {
  name = 'rulr';

  validate() {
    return dataType(this.data);
  }
}
