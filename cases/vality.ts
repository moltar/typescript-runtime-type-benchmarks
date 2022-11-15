import { v, validate } from 'vality';
import { addCase } from '../benchmarks';

const dataType = v.object({
  number: v.number,
  negNumber: v.number,
  maxNumber: v.number({ allowUnsafe: true }),
  string: v.string,
  longString: v.string,
  boolean: v.boolean,
  deeplyNested: v.object({
    foo: v.string,
    num: v.number,
    bool: v.boolean,
  }),
});

addCase('vality', 'parseSafe', data => {
  const res = validate(dataType, data, { bail: true, strict: true });

  if (res.valid) return res.data;
  throw new Error('Invalid!');
});

addCase('vality', 'parseStrict', data => {
  const res = validate(dataType, data, {
    bail: true,
    strict: true,
    allowExtraProperties: false,
  });

  if (res.valid) return res.data;
  throw new Error('Invalid!');
});

addCase('vality', 'assertLoose', data => {
  const res = validate(dataType, data, { bail: true, strict: true });

  if (res.valid) return true;
  throw new Error('Invalid!');
});

addCase('vality', 'assertStrict', data => {
  const res = validate(dataType, data, {
    bail: true,
    strict: true,
    allowExtraProperties: false,
  });

  if (res.valid) return true;
  throw new Error('Invalid!');
});
