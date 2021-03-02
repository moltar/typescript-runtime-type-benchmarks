import { Case } from './abstract';
import * as v from '@badrap/valita';

const dataType = v.object({
  number: v.number(),
  negNumber: v.number(),
  maxNumber: v.number(),
  string: v.string(),
  longString: v.string(),
  boolean: v.boolean(),
  deeplyNested: v.object({
    foo: v.string(),
    num: v.number(),
    bool: v.boolean(),
  }),
});

export class ValitaCase extends Case implements Case {
  name = 'valita';

  validate() {
    return dataType.parse(this.data);
  }
}
