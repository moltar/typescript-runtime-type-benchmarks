import { object, number, string, boolean, parse, strictObject } from 'valibot';
import { addCase } from '../benchmarks';

const LooseSchema = object({
  number: number(),
  negNumber: number(),
  maxNumber: number(),
  string: string(),
  longString: string(),
  boolean: boolean(),
  deeplyNested: object({
    foo: string(),
    num: number(),
    bool: boolean(),
  }),
});

const StrictSchema = strictObject({
  number: number(),
  negNumber: number(),
  maxNumber: number(),
  string: string(),
  longString: string(),
  boolean: boolean(),
  deeplyNested: strictObject({
    foo: string(),
    num: number(),
    bool: boolean(),
  }),
});

addCase('valibot', 'assertLoose', data => {
  parse(LooseSchema, data, {
    abortEarly: true,
  });
  return true;
});

addCase('valibot', 'assertStrict', data => {
  parse(StrictSchema, data, {
    abortEarly: true,
  });
  return true;
});

addCase('valibot', 'parseSafe', data => {
  return parse(LooseSchema, data, {
    abortEarly: true,
  });
});

addCase('valibot', 'parseStrict', data => {
  return parse(StrictSchema, data, {
    abortEarly: true,
  });
});
