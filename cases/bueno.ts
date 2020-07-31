import { check, enUS, number, object, string, boolean, result } from 'bueno';
import { Case } from './abstract';

const dataType = object({
  number: number,
  negNumber: number,
  maxNumber: number,
  string: string,
  longString: string,
  boolean: boolean,
  deeplyNested: object({
    foo: string,
    num: number,
    bool: boolean,
  }),
});

export class BuenoCase extends Case implements Case {
  name = 'bueno';

  validate() {
    const err = check(this.data, dataType, enUS);

    if (err) {
      throw new Error(err);
    }

    return result(this.data, dataType);
  }
}
