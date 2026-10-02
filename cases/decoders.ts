import { boolean, exact, inexact, number, object, string } from 'decoders';
import { addCase } from '../benchmarks';

const shape = {
  number,
  negNumber: number,
  maxNumber: number,
  string,
  longString: string,
  boolean,
};
const nested = { foo: string, num: number, bool: boolean };

const dataType = object({ ...shape, deeplyNested: object(nested) });
const dataTypeStrict = exact({ ...shape, deeplyNested: exact(nested) });
const dataTypeLoose = inexact({ ...shape, deeplyNested: inexact(nested) });

addCase('decoders', 'parseSafe', data => {
  return dataType.verify(data);
});

addCase('decoders', 'parseStrict', data => {
  return dataTypeStrict.verify(data);
});

addCase('decoders', 'assertLoose', data => {
  dataTypeLoose.verify(data);
  return true;
});

addCase('decoders', 'assertStrict', data => {
  dataTypeStrict.verify(data);
  return true;
});
