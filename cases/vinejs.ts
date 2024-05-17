import vine from '@vinejs/vine';
import { addCase } from '../benchmarks';

const LooseSchema = vine.object({
  number: vine.number(),
  negNumber: vine.number(),
  maxNumber: vine.number(),
  string: vine.string(),
  longString: vine.string(),
  boolean: vine.boolean(),
  deeplyNested: vine.object({
    foo: vine.string(),
    num: vine.number(),
    bool: vine.boolean(),
  }),
});

const looseValidator = vine.compile(LooseSchema);

// TODO: no strict validation feature yet
//const StrictSchema = vine.object({
//  number: vine.number(),
//  negNumber: vine.number(),
//  maxNumber: vine.number(),
//  string: vine.string(),
//  longString: vine.string(),
//  boolean: vine.boolean(),
//  deeplyNested: vine.object({
//    foo: vine.string(),
//    num: vine.number(),
//    bool: vine.boolean(),
//  }),
//});
//
//const strictValidator = vine.compile(StrictSchema);

addCase('vinejs', 'assertLoose', async data => {
  await looseValidator.validate(data);
  return true;
});

//addCase('vinejs', 'assertStrict', async data => {
//  await strictValidator.validate(data);
//  return true;
//});

addCase('vinejs', 'parseSafe', async data => {
  return await looseValidator.validate(data);
});

//addCase('vinejs', 'parseStrict', async data => {
//  return await strictValidator.validate(data);
//});
