import * as yup from 'yup';
import { Case } from './abstract';

const dataType = yup.object({
  number: yup.number().required(),
  negNumber: yup.number().required(),
  maxNumber: yup.number().required(),
  string: yup.string().required(),
  longString: yup.string().required(),
  boolean: yup.bool().required(),
  deeplyNested: yup.object({
    foo: yup.string().required(),
    num: yup.number().required(),
    bool: yup.bool().required(),
  }),
});

export class YupCase extends Case implements Case {
  name = 'yup';

  validate() {
    return dataType.validate(this.data, { recursive: true });
  }
}
