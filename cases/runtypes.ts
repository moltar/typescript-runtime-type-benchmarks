import { Boolean, Number, String, Record } from 'runtypes';
import { Case } from './abstract';

const dataType = Record({
  number: Number,
  negNumber: Number.withConstraint(n => n < 0),
  maxNumber: Number,
  string: String,
  longString: String.withConstraint(s => s.length > 100),
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
