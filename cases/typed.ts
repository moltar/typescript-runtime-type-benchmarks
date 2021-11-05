import { boolean, number, object, string } from 'typed';

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

export class TypedCase extends Case implements Case {
  name = 'typed';

  validate() {
    const result = dataType(this.data);

    if (result.success) {
      return result.value;
    }

    throw new Error(
      `Invalid data: ${result.errors.map(err => err.message).join('\n')}`
    );
  }
}
