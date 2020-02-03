import { Boolean, Number, String, Record } from 'runtypes'
import { Case } from './abstract'

const DataType = Record({
  number: Number,
  neg_number: Number.withConstraint(n => n < 0),
  max_number: Number,
  string: String,
  long_string: String.withConstraint(s => s.length > 100),
  boolean: Boolean,
  deeplyNested: Record({
    foo: String,
    num: Number,
    bool: Boolean
  })
})

export class RuntypesCase extends Case implements Case {
  name = 'runtypes'

  validate() {
    return DataType.check(this.data)
  }
}
