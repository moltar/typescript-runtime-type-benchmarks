import * as S from 'sury';

import { createCase } from '../benchmarks';

S.global({
  disableNanNumberValidation: true,
});

const schema = S.schema({
  number: S.number,
  negNumber: S.number,
  maxNumber: S.number,
  string: S.string,
  longString: S.string,
  boolean: S.boolean,
  deeplyNested: {
    foo: S.string,
    num: S.number,
    bool: S.boolean,
  },
});

createCase('sury', 'parseSafe', () => {
  const parseSafe = S.compile(schema, 'Any', 'Output', 'Sync');
  return data => {
    return parseSafe(data);
  };
});

createCase('sury', 'parseStrict', () => {
  const parseStrict = S.compile(S.deepStrict(schema), 'Any', 'Output', 'Sync');
  return data => {
    return parseStrict(data);
  };
});

createCase('sury', 'assertLoose', () => {
  const assertLoose = S.compile(schema, 'Any', 'Assert', 'Sync');
  return data => {
    assertLoose(data)!;
    return true;
  };
});

createCase('sury', 'assertStrict', () => {
  const assertStrict = S.compile(S.deepStrict(schema), 'Any', 'Assert', 'Sync');
  return data => {
    assertStrict(data)!;
    return true;
  };
});
