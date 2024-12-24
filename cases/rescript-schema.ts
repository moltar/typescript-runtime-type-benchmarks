import * as S from 'rescript-schema';

import { createCase } from '../benchmarks/index.ts';

S.setGlobalConfig({
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

createCase('rescript-schema', 'parseSafe', () => {
  const parseSafe = S.compile(schema, 'Any', 'Output', 'Sync');
  return data => {
    return parseSafe(data);
  };
});

createCase('rescript-schema', 'parseStrict', () => {
  const parseStrict = S.compile(S.deepStrict(schema), 'Any', 'Output', 'Sync');
  return data => {
    return parseStrict(data);
  };
});

createCase('rescript-schema', 'assertLoose', () => {
  const assertLoose = S.compile(schema, 'Any', 'Assert', 'Sync');
  return data => {
    assertLoose(data)!;
    return true;
  };
});

createCase('rescript-schema', 'assertStrict', () => {
  const assertStrict = S.compile(S.deepStrict(schema), 'Any', 'Assert', 'Sync');
  return data => {
    assertStrict(data)!;
    return true;
  };
});
