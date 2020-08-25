import { string, number, boolean, object, guard } from 'decoders';
import { Case } from './abstract';

const dataType = object({
  number,
  negNumber: number,
  maxNumber: number,
  string,
  longString: string,
  boolean,
  deeplyNested: object({
    foo: string,
    num: number,
    bool: boolean,
  }),
});

const dataTypeGuard = guard(dataType);

export class DecodersCase extends Case implements Case {
  name = 'decoders';

  validate() {
    return dataTypeGuard(this.data);
  }
}
