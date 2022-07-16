import { guard, deserializeFunction, Negative } from '@deepkit/type';
import { addCase } from '../benchmarks';

interface DataType {
  number: number;
  negNumber: number & Negative;
  maxNumber: number;
  string: string;
  longString: string;
  boolean: boolean;
  deeplyNested: {
    foo: string;
    num: number;
    bool: boolean;
  };
}

const dataTypeDeserialize = deserializeFunction<DataType>();
const dataTypeGuard = guard<DataType>();

addCase('deepkit', 'parseSafe', data => {
  return dataTypeDeserialize(data);
});

addCase('deepkit', 'assertLoose', data => {
  const valid = dataTypeGuard(data);
  if (!valid) throw new Error('invalid');
  return true;
});
