import { object, number, string, boolean, parse, strict, is } from 'valibot';
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

addCase('valibot', 'assertLoose', data => {
  return is(LooseSchema, data);
});

addCase('valibot', 'assertStrict', data => {
  return is(StrictSchema, data);
});

addCase('valibot', 'parseSafe', data => {
  return parse(LooseSchema, data);
});

addCase('valibot', 'parseStrict', data => {
  return parse(StrictSchema, data);
});
