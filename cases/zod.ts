import * as z from 'zod';
import { Case } from './abstract';

const dataType = z.object({
  number: z.number(),
  negNumber: z.number(),
  maxNumber: z.number(),
  string: z.string(),
  longString: z.string(),
  boolean: z.boolean(),
  deeplyNested: z.object({
    foo: z.string(),
    num: z.number(),
    bool: z.boolean(),
  }),
});

export class ZodCase extends Case implements Case {
  name = 'zod';

  validate() {
    return dataType.parse(this.data)
  }
}
