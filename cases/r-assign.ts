import pkg from 'r-assign/lib/index.js';
const { boolean, number, object, strictObject, string, parseType } = pkg;

import { createCase } from '../benchmarks/index.ts';

createCase('r-assign', 'parseSafe', () => {
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

  const parseData = parseType(dataType);

  return data => {
    return parseData(data);
  };
});

createCase('r-assign', 'parseStrict', () => {
  const dataType = strictObject({
    number: number,
    negNumber: number,
    maxNumber: number,
    string: string,
    longString: string,
    boolean: boolean,
    deeplyNested: strictObject({
      foo: string,
      num: number,
      bool: boolean,
    }),
  });

  const parseData = parseType(dataType);

  return data => {
    return parseData(data);
  };
});

createCase('r-assign', 'assertLoose', () => {
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

  const parseData = parseType(dataType);

  return data => {
    parseData(data);

    return true;
  };
});

createCase('r-assign', 'assertStrict', () => {
  const dataType = strictObject({
    number: number,
    negNumber: number,
    maxNumber: number,
    string: string,
    longString: string,
    boolean: boolean,
    deeplyNested: strictObject({
      foo: string,
      num: number,
      bool: boolean,
    }),
  });

  const parseData = parseType(dataType);

  return data => {
    parseData(data);

    return true;
  };
});
