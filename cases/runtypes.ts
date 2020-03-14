import { Boolean, Number, String, Record } from 'runtypes';
import { Case } from './abstract';

const dataType = Record({
  number: Number,
  negNumber: Number,
  maxNumber: Number,
  string: String,
  longString: String,
  boolean: Boolean,
  deeplyNested: Record({
    foo: String,
    num: Number,
    bool: Boolean,
  }),
});

export class RuntypesCase extends Case implements Case {
  name = 'runtypes';

  validate() {
    return dataType.check(this.data);
  }
}
