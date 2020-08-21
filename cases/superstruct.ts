import { object, string, number, boolean, coerce } from 'superstruct';
import { Case } from './abstract';

const dataType = object({
  number: number(),
  negNumber: number(),
  maxNumber: number(),
  string: string(),
  longString: string(),
  boolean: boolean(),
  deeplyNested: object({
    foo: string(),
    num: number(),
    bool: boolean(),
  }),
});

export class SuperstructCase extends Case implements Case {
  name = 'superstruct';

  validate() {
    return coerce(this.data, dataType);
  }
}
