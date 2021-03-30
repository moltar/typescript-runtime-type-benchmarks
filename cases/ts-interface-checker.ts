import * as t from 'ts-interface-checker';
import { Case } from './abstract';

const dataType = t.iface([], {
  number: "number",
  negNumber: "number",
  maxNumber: "number",
  string: "string",
  longString: "string",
  boolean: "boolean",
  deeplyNested: t.iface([], {
    foo: "string",
    num: "number",
    bool: "boolean",
  }),
});

const {dataType: dataTypeChecker} = t.createCheckers({dataType});

export class TsInterfaceCheckerCase extends Case implements Case {
  name = 'ts-interface-checker';

  validate() {
    dataTypeChecker.check(this.data);
    return this.data;
  }
}
