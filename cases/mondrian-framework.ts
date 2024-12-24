import { createCase } from '../benchmarks/index.ts';
import { model } from '@mondrian-framework/model';

const dataType = model.object({
  number: model.number(),
  negNumber: model.number(),
  maxNumber: model.number(),
  string: model.string(),
  longString: model.string(),
  boolean: model.boolean(),
  deeplyNested: model.object({
    foo: model.string(),
    num: model.number(),
    bool: model.boolean(),
  }),
});

createCase('mondrian-framework', 'parseSafe', () => {
  return data => {
    const result = dataType.decode(data, {
      fieldStrictness: 'allowAdditionalFields',
      errorReportingStrategy: 'stopAtFirstError',
      typeCastingStrategy: 'expectExactTypes',
    });
    if (result.isFailure) {
      throw new Error();
    }
    return result.value;
  };
});

createCase('mondrian-framework', 'parseStrict', () => {
  return data => {
    const result = dataType.decode(data, {
      fieldStrictness: 'expectExactFields',
      errorReportingStrategy: 'stopAtFirstError',
      typeCastingStrategy: 'expectExactTypes',
    });
    if (result.isFailure) {
      throw new Error();
    }
    return result.value;
  };
});

createCase('mondrian-framework', 'assertLoose', () => {
  return data => {
    const result = dataType.decode(data, {
      fieldStrictness: 'allowAdditionalFields',
      errorReportingStrategy: 'stopAtFirstError',
      typeCastingStrategy: 'expectExactTypes',
    });
    if (result.isFailure) {
      throw new Error();
    }
    return true;
  };
});

createCase('mondrian-framework', 'assertStrict', () => {
  return data => {
    const result = dataType.decode(data, {
      fieldStrictness: 'expectExactFields',
      errorReportingStrategy: 'stopAtFirstError',
      typeCastingStrategy: 'expectExactTypes',
    });
    if (result.isFailure) {
      throw new Error();
    }
    return true;
  };
});
