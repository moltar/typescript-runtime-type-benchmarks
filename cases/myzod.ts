import myzod from 'myzod';
import { Case } from './abstract';

const dataType = myzod.object({
  number: myzod.number(),
  negNumber: myzod.number(),
  maxNumber: myzod.number(),
  string: myzod.string(),
  longString: myzod.string(),
  boolean: myzod.boolean(),
  deeplyNested: myzod.object({
    foo: myzod.string(),
    num: myzod.number(),
    bool: myzod.boolean(),
  }),
});

export class MyzodCase extends Case implements Case {
  name = 'myzod';

  validate() {
    return dataType.parse(this.data);
  }
}
