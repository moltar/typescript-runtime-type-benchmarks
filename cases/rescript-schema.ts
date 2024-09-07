import * as S from 'rescript-schema';

import { createCase } from '../benchmarks';

const makeSchema = () =>
  S.object({
    number: S.number,
    negNumber: S.number,
    maxNumber: S.number,
    string: S.string,
    longString: S.string,
    boolean: S.boolean,
    deeplyNested: S.object({
      foo: S.string,
      num: S.number,
      bool: S.boolean,
    }),
  });

createCase('rescript-schema', 'parseSafe', () => {
  S.setGlobalConfig({
    disableNanNumberCheck: true,
  });
  const schema = makeSchema();

  return data => {
    return schema.parseOrThrow(data);
  };
});

createCase('rescript-schema', 'parseStrict', () => {
  S.setGlobalConfig({
    disableNanNumberCheck: true,
    defaultUnknownKeys: 'Strict',
  });
  const schema = makeSchema();

  return data => {
    return schema.parseOrThrow(data);
  };
});

createCase('rescript-schema', 'assertLoose', () => {
  S.setGlobalConfig({
    disableNanNumberCheck: true,
  });
  const schema = makeSchema();

  return data => {
    schema.assert(data)!;
    return true;
  };
});

createCase('rescript-schema', 'assertStrict', () => {
  S.setGlobalConfig({
    disableNanNumberCheck: true,
    defaultUnknownKeys: 'Strict',
  });
  const schema = makeSchema();

  return data => {
    schema.assert(data)!;
    return true;
  };
});
