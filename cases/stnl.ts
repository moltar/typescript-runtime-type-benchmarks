import { build, t } from 'stnl';

import { createCase } from '../benchmarks';

const assertLoose = t.dict({
  number: t.float,
  negNumber: t.float,
  maxNumber: t.float,
  string: t.string,
  longString: t.string,
  boolean: t.bool,
  deeplyNested: t.dict({
    foo: t.string,
    num: t.float,
    bool: t.bool,
  }),
});

createCase('stnl (just-in-time)', 'assertLoose', () => {
  const check = build.json.assert.compile(assertLoose);

  return data => {
    if (check(data)) return true;
    throw null;
  };
});
