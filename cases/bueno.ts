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
import { createCase } from '../benchmarks';

createCase('bueno', 'validate', () => {
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

  return (data: any) => {
    const err = check(data, dataType, enUS);

    if (err) {
      throw new Error(err);
    }

    return result(data, dataType);
  };
});

createCase('bueno', 'validateStrict', () => {
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

  return (data: any) => {
    const err = check(data, dataTypeStrict, enUS);

    if (err) {
      throw new Error(err);
    }

    return result(data, dataTypeStrict);
  };
});

createCase('bueno', 'validateLoose', () => {
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

  return (data: any) => {
    const err = check(data, dataTypeLoose, enUS);

    if (err) {
      throw new Error(err);
    }

    return result(data, dataTypeLoose);
  };
});
