import Joi from 'joi';
import { createCase } from '../benchmarks';

const schema = Joi.object({
  number: Joi.number().required(),
  negNumber: Joi.number().required(),
  maxNumber: Joi.number().unsafe().required(),
  string: Joi.string().required(),
  longString: Joi.string().required(),
  boolean: Joi.boolean().required(),
  deeplyNested: Joi.object({
    foo: Joi.string().required(),
    num: Joi.number().required(),
    bool: Joi.boolean().required(),
  }).required(),
});

createCase('joi', 'parseSafe', () => {
  return data => {
    const { value, error } = schema.validate(data, {
      stripUnknown: true,
      allowUnknown: true,
      convert: false,
    });

    if (error) throw error;

    return value;
  };
});

createCase('joi', 'parseStrict', () => {
  return data => {
    const { value, error } = schema.validate(data, {
      allowUnknown: false,
      convert: false,
    });

    if (error) throw error;

    return value;
  };
});

createCase('joi', 'assertLoose', () => {
  return data => {
    const { error } = schema.validate(data, {
      stripUnknown: false,
      convert: false,
      allowUnknown: true,
    });
    if (error) throw error;
    return true;
  };
});

createCase('joi', 'assertStrict', () => {
  const strictSchema = schema.options({ convert: false });
  return data => {
    const { error } = strictSchema.validate(data, {
      convert: false,
      allowUnknown: false,
    });
    if (error) throw error;
    return true;
  };
});
