import * as p from './build';
import { addCase } from '../../benchmarks';

const dataTypeStrip = p
  .object({
    number: p.number(),
    negNumber: p.number(),
    maxNumber: p.number(),
    string: p.string(),
    longString: p.string(),
    boolean: p.boolean(),
    deeplyNested: p
      .object({
        foo: p.string(),
        num: p.number(),
        bool: p.boolean(),
      })
      .strip(),
  })
  .strip();

const dataTypeStrict = p
  .object({
    number: p.number(),
    negNumber: p.number(),
    maxNumber: p.number(),
    string: p.string(),
    longString: p.string(),
    boolean: p.boolean(),
    deeplyNested: p
      .object({
        foo: p.string(),
        num: p.number(),
        bool: p.boolean(),
      })
      .strict(),
  })
  .strict();

const dataTypePassthrough = p
  .object({
    number: p.number(),
    negNumber: p.number(),
    maxNumber: p.number(),
    string: p.string(),
    longString: p.string(),
    boolean: p.boolean(),
    deeplyNested: p
      .object({
        foo: p.string(),
        num: p.number(),
        bool: p.boolean(),
      })
      .passthrough(),
  })
  .passthrough();

addCase('paseri', 'parseSafe', data => {
  return dataTypeStrip.parse(data);
});

addCase('paseri', 'parseStrict', data => {
  return dataTypeStrict.parse(data);
});

addCase('paseri', 'assertLoose', data => {
  dataTypePassthrough.parse(data);

  return true;
});

addCase('paseri', 'assertStrict', data => {
  dataTypeStrict.parse(data);

  return true;
});
