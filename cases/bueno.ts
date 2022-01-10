import {
  boolean,
  check,
  enUS,
  number,
  object,
  objectExact,
  objectInexact,
  result,
  string,
} from 'bueno';
import { addCase } from '../benchmarks';

const dataType = object({
  number: number,
  negNumber: number,
  maxNumber: number,
  string: string,
  longString: string,
  boolean: boolean,
  deeplyNested: object({
    foo: string,
    num: number,
    bool: boolean,
  }),
});

const dataTypeStrict = objectExact({
  number: number,
  negNumber: number,
  maxNumber: number,
  string: string,
  longString: string,
  boolean: boolean,
  deeplyNested: objectExact({
    foo: string,
    num: number,
    bool: boolean,
  }),
});

const dataTypeLoose = objectInexact({
  number: number,
  negNumber: number,
  maxNumber: number,
  string: string,
  longString: string,
  boolean: boolean,
  deeplyNested: objectInexact({
    foo: string,
    num: number,
    bool: boolean,
  }),
});

addCase(
  'bueno',
  'parseSafe',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (data: any) => {
    const err = check(data, dataType, enUS);

    if (err) {
      throw new Error(err);
    }

    return result(data, dataType);
  }
);

addCase(
  'bueno',
  'parseStrict',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (data: any) => {
    const err = check(data, dataTypeStrict, enUS);

    if (err) {
      throw new Error(err);
    }

    return result(data, dataTypeStrict);
  }
);

addCase(
  'bueno',
  'assertLoose',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (data: any) => {
    const err = check(data, dataTypeLoose, enUS);

    if (err) {
      throw new Error(err);
    }

    return true;
  }
);

addCase(
  'bueno',
  'assertStrict',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (data: any) => {
    const err = check(data, dataTypeStrict, enUS);

    if (err) {
      throw new Error(err);
    }

    return true;
  }
);
