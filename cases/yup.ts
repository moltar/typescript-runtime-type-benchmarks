import * as yup from 'yup';
import { createCase } from '../benchmarks';

createCase('yup', 'validateLoose', () => {
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
    return dataType.validateSync(data, { recursive: true, strict: false });
  };
});

createCase('yup', 'validate', () => {
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
