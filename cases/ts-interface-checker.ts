import * as t from 'ts-interface-checker';
import { Case } from './abstract';
import { Data } from '../data';

const dataType = t.iface([], {
  number: 'number',
  negNumber: 'number',
  maxNumber: 'number',
  string: 'string',
  longString: 'string',
  boolean: 'boolean',
  deeplyNested: t.iface([], {
    foo: 'string',
    num: 'number',
    bool: 'boolean',
  }),
});

const suite = { dataType };
const dataTypeChecker = t.createCheckers(suite).dataType as t.CheckerT<Data>;

export class TsInterfaceCheckerCase extends Case implements Case {
  name = 'ts-interface-checker';

  validate() {
    const { data } = this;

    if (dataTypeChecker.test(data)) {
      return data;
    }

    // Calling .check() provides a more helpful error, but does not (at the moment) include a
    // typescript type guard like .test() above.
    dataTypeChecker.check(data);
    throw new Error('Invalid');
  }
}
