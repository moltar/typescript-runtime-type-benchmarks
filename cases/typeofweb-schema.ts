import { object, number, string, validate, boolean } from '@typeofweb/schema';
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
  })(),
})();

const validator = validate(dataType);

export class TypeOfWebSchemaCase extends Case implements Case {
  name = '@typeofweb/schema';

  validate() {
    return validator(this.data);
  }
}
