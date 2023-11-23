import * as S from 'rescript-schema';

import { createCase } from '../benchmarks';

createCase('rescript-schema', 'parseSafe', () => {
  const schema = S.object({
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

  return data => {
    return S.parseOrThrow(schema, data);
  };
});

createCase('rescript-schema', 'parseStrict', () => {
  const schema = S.Object.strict(
    S.object({
      number: S.number,
      negNumber: S.number,
      maxNumber: S.number,
      string: S.string,
      longString: S.string,
      boolean: S.boolean,
      deeplyNested: S.Object.strict(
        S.object({
          foo: S.string,
          num: S.number,
          bool: S.boolean,
        })
      ),
    })
  );

  return data => {
    return S.parseOrThrow(schema, data);
  };
});

createCase('rescript-schema', 'assertLoose', () => {
  const schema = S.object({
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

  return data => {
    S.parseOrThrow(schema, data);

    return true;
  };
});

createCase('rescript-schema', 'assertStrict', () => {
  const schema = S.Object.strict(
    S.object({
      number: S.number,
      negNumber: S.number,
      maxNumber: S.number,
      string: S.string,
      longString: S.string,
      boolean: S.boolean,
      deeplyNested: S.Object.strict(
        S.object({
          foo: S.string,
          num: S.number,
          bool: S.boolean,
        })
      ),
    })
  );

  return data => {
    S.parseOrThrow(schema, data);

    return true;
  };
});
