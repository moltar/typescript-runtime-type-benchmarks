import * as yup from 'yup';
import { Case } from './abstract';

const dataType = yup.object({
  number: yup.number(),
  negNumber: yup.number(),
  maxNumber: yup.number(),
  string: yup.string(),
  longString: yup.string(),
  boolean: yup.bool().required(),
  deeplyNested: yup.object({
    foo: yup.string(),
    num: yup.number(),
    bool: yup.bool().required(),
  }),
});

export class YupCase extends Case implements Case {
  name = 'yup';

  validate() {
    return dataType.validate(this.data, { recursive: true });
  }
}
