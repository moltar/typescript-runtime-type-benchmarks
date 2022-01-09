import { v, compile } from 'suretype';
import { createCase } from '../benchmarks';

createCase('suretype', 'assertLoose', () => {
  const dataSchema = v.object({
    number: v.number().required(),
    negNumber: v.number().required(),
    maxNumber: v.number().required(),
    string: v.string().required(),
    longString: v.string().required(),
    boolean: v.boolean().required(),
    deeplyNested: v
      .object({
        foo: v.string().required(),
        num: v.number().required(),
        bool: v.boolean().required(),
      })
      .required(),
  });

  const ensureData = compile(dataSchema, { ensure: true });

  return data => {
    ensureData(data);

    return true;
  };
});
