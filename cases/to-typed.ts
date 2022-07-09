import { addCase } from '../benchmarks';
import { Guard, Cast } from 'to-typed';

const model = {
  number: 0,
  negNumber: 0,
  maxNumber: 0,
  string: '',
  longString: '',
  boolean: false,
  deeplyNested: {
    foo: '',
    num: 0,
    bool: false,
  },
};

const guardLoose = Guard.is(model);
const guardStrict = guardLoose.config({ keyGuarding: 'strict' });
const castLoose = Cast.as(model);

addCase('to-typed', 'assertLoose', data => {
  if (guardLoose.guard(data)) {
    return true;
  }

  throw new Error('Invalid');
});

addCase('to-typed', 'assertStrict', data => {
  if (guardStrict.guard(data)) {
    return true;
  }

  throw new Error('Invalid');
});

addCase('to-typed', 'parseSafe', data => {
  return castLoose.cast(data).else(() => {
    throw new Error('Invalid');
  });
});

addCase('to-typed', 'parseStrict', data => {
  return guardStrict.cast(data).else(() => {
    throw new Error('Invalid');
  });
});
