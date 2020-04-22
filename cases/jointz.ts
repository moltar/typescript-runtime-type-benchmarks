import jointz from 'jointz';
import { Case } from './abstract';

const dataType = jointz.object({
  number: jointz.number(),
  negNumber: jointz.number(),
  maxNumber: jointz.number(),
  string: jointz.string(),
  longString: jointz.string(),
  boolean: jointz.,
  deeplyNested: jointz.object({
    foo: jointz.string(),
    num: jointz.number(),
    bool: jointz.bool(),
  }),
});

export class JointzCase extends Case implements Case {
  name = 'jointz';

  validate() {
    return dataType.parse(this.data);
  }
}
