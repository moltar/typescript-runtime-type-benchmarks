import { object, number, boolean, string } from '@ailabs/ts-utils/dist/decoder';
import { Case } from './abstract';

const dataType = object('Data', {
  number,
  negNumber: number,
  maxNumber: number,
  string,
  longString: string,
  boolean,
  deeplyNested: object('DeeplyNested', {
    foo: string,
    num: number,
    bool: boolean,
  }),
});

export class TsUtilsCase extends Case implements Case {
  name = 'ts-utils';

  validate() {
    return dataType(this.data).toPromise()
  }
}
