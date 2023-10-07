import { type } from 'arktype';
import { createCase } from '../benchmarks';

const dataType = type({
  number: 'number',
  negNumber: 'number',
  maxNumber: 'number',
  string: 'string',
  longString: 'string',
  boolean: 'boolean',
  deeplyNested: {
    foo: 'string',
    num: 'number',
    bool: 'boolean',
  },
});

const dataTypeStrict = type(dataType, { keys: 'strict' });

// TODO: unlike other libraries, arktype does not remove extra keys
// createCase('arktype', 'parseSafe', () => {
//   return data => {
//     const { data: result, problems } = dataType(data);
//     if (problems) throw new Error(problems.summary);
//
//     return result;
//   };
// });

createCase('arktype', 'parseStrict', () => {
  return data => {
    const { data: result, problems } = dataTypeStrict(data);
    if (problems) throw new Error(problems.summary);

    return result;
  };
});

createCase('arktype', 'assertLoose', () => {
  return data => {
    const { problems } = dataType(data);
    if (problems) throw new Error(problems.summary);

    return true;
  };
});

createCase('arktype', 'assertStrict', () => {
  return data => {
    const { problems } = dataTypeStrict(data);
    if (problems) throw new Error(problems.summary);

    return true;
  };
});
