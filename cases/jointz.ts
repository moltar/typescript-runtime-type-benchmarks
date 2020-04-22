import jointz from 'jointz';
import { Case } from './abstract';

const dataType = jointz.object({
  number: jointz.number(),
  negNumber: jointz.number(),
  maxNumber: jointz.number(),
  string: jointz.string(),
  longString: jointz.string(),
  boolean: jointz.constant(true, false),
  deeplyNested: jointz.object({
    foo: jointz.string(),
    num: jointz.number(),
    bool: jointz.constant(true, false),
  }),
});

export class JointzCase extends Case implements Case {
  name = 'jointz';

  validate() {
    const { data } = this;

    if (dataType.isValid(data)) {
      return data;
    }

    throw dataType.validate(data);
  }
}
