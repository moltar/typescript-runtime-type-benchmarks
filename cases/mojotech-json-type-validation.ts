import {
  string,
  number,
  object,
  boolean,
} from '@mojotech/json-type-validation';
import { Case } from './abstract';

const dataType = object({
  number: number(),
  negNumber: number(),
  maxNumber: number(),
  string: string(),
  longString: string(),
  boolean: boolean(),
  deeplyNested: object({
    foo: string(),
    num: number(),
    bool: boolean(),
  }),
});

export class MojoTechJsonTypeValidationCase extends Case implements Case {
  name = '@mojotech/json-type-validation';

  validate() {
    return dataType.runWithException(this.data);
  }
}
