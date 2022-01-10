import * as t from 'ts-interface-checker';
import { createCase } from '../benchmarks';

createCase('ts-interface-checker', 'assertLoose', () => {
  const dataType = t.iface([], {
    number: 'number',
    negNumber: 'number',
    maxNumber: 'number',
    string: 'string',
    longString: 'string',
    boolean: 'boolean',
    deeplyNested: t.iface([], {
      foo: 'string',
      num: 'number',
      bool: 'boolean',
    }),
  });

  const suite = { dataType };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const dataTypeChecker = t.createCheckers(suite).dataType as t.CheckerT<any>;

  return data => {
    if (dataTypeChecker.test(data)) {
      return true;
    }

    // Calling .check() provides a more helpful error, but does not (at the moment) include a
    // typescript type guard like .test() above.
    dataTypeChecker.check(data);

    throw new Error('Invalid');
  };
});
