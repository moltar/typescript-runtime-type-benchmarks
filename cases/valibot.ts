import {
  object,
  number,
  string,
  boolean,
  parse,
  type ParseInfo,
  strict,
} from 'valibot';
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

const StrictSchema = strict(
  object({
    number: number(),
    negNumber: number(),
    maxNumber: number(),
    string: string(),
    longString: string(),
    boolean: boolean(),
    deeplyNested: strict(
      object({
        foo: string(),
        num: number(),
        bool: boolean(),
      })
    ),
  })
);

const info: ParseInfo = { abortEarly: true };

addCase('valibot', 'assertLoose', data => {
  parse(LooseSchema, data, info);
  return true;
});

addCase('valibot', 'assertStrict', data => {
  parse(StrictSchema, data, info);
  return true;
});

addCase('valibot', 'parseSafe', data => {
  return parse(LooseSchema, data, info);
});

addCase('valibot', 'parseStrict', data => {
  return parse(StrictSchema, data, info);
});
