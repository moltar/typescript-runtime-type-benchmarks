import compose from 'stnl/compilers/validate-json/compose';
import { build } from 'stnl/compilers/validate-json';
import stnl from 'stnl';

import { createCase } from '../benchmarks';

const assertLoose = stnl({
  props: {
    number: 'f64',
    negNumber: 'f64',
    maxNumber: 'f64',
    string: 'string',
    longString: 'string',
    boolean: 'bool',
    deeplyNested: {
      props: {
        foo: 'string',
        num: 'f64',
        bool: 'bool',
      },
    },
  },
});

createCase('stnl (composition)', 'assertLoose', () => {
  const check = compose(assertLoose);

  return data => {
    if (check(data)) return true;
    throw null;
  };
});

createCase('stnl (just-in-time)', 'assertLoose', () => {
  const check = build(assertLoose);

  return data => {
    if (check(data)) return true;
    throw null;
  };
});
