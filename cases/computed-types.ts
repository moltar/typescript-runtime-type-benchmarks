import Schema, { string, number, boolean } from 'computed-types';
import { Case } from './abstract';

const validator = Schema({
  number: number,
  negNumber: number.lt(0),
  maxNumber: number,
  string: string,
  longString: string,
  boolean: boolean,
  deeplyNested: {
    foo: string,
    num: number,
    bool: boolean,
  },
});

export class ComputedTypesCase extends Case implements Case {
  name = 'computed-types';

  validate() {
    return validator(this.data);
  }
}
