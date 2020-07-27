import * as rt from 'simple-runtypes';
import { Case } from './abstract';

const checkData = rt.record({
  number: rt.integer(),
  negNumber: rt.number(),
  maxNumber: rt.number(),
  string: rt.string(),
  longString: rt.string(),
  boolean: rt.boolean(),
  deeplyNested: rt.record({
    foo: rt.string(),
    num: rt.number(),
    bool: rt.boolean(),
  }),
});

export class SimpleRuntypesCase extends Case implements Case {
  name = 'simple-runtypes';

  validate() {
    return checkData(this.data);
  }
}
