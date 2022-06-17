import { validate, deserialize, Negative } from '@deepkit/type';
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

addCase('deepkit', 'parseSafe', data => {
  return deserialize<DataType>(data);
});

addCase('deepkit', 'assertLoose', data => {
  const result = validate<DataType>(data);
  if (result.length > 0) throw new Error('invalid');
  return true;
});
