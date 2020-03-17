import { Schema, Integer, Bool } from 'funval';
import { Case } from './abstract';

const validator = Schema({
  number: Integer,
  negNumber: Integer,
  maxNumber: Integer,
  string: String,
  longString: String,
  boolean: Bool,
  deeplyNested: Schema({
    foo: String,
    num: Integer,
    bool: Bool,
  }),
})

export class FunvalCase extends Case implements Case {
  name = 'funval';

  validate() {
    return validator(this.data as any);
  }
}
