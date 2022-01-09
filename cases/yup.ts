import * as yup from 'yup';
import { createCase } from '../benchmarks';

createCase('yup', 'assertLoose', () => {
  const dataType = yup.object({
    number: yup.number().required(),
    negNumber: yup.number().required(),
    maxNumber: yup.number().required(),
    string: yup.string().required(),
    longString: yup.string().required(),
    boolean: yup.bool().required(),
    deeplyNested: yup.object({
      foo: yup.string().required(),
      num: yup.number().required(),
      bool: yup.bool().required(),
    }),
  });

  return data => {
    const res = dataType.isValidSync(data, { recursive: true, strict: false });

    if (!res) {
      throw new Error('invalid');
    }

    return res;
  };
});

createCase('yup', 'parseSafe', () => {
  const dataType = yup.object({
    number: yup.number().required(),
    negNumber: yup.number().required(),
    maxNumber: yup.number().required(),
    string: yup.string().required(),
    longString: yup.string().required(),
    boolean: yup.bool().required(),
    deeplyNested: yup.object({
      foo: yup.string().required(),
      num: yup.number().required(),
      bool: yup.bool().required(),
    }),
  });

  return data => {
    return dataType.validateSync(data, {
      recursive: true,
      strict: false,
      stripUnknown: true,
    });
  };
});
