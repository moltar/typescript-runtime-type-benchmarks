import * as S from 'rescript-struct';

import { createCase } from '../benchmarks';

createCase('rescript-struct', 'parseSafe', () => {
  const struct = S.object({
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
    return S.parseOrThrow(struct, data);
  };
});

createCase('rescript-struct', 'parseStrict', () => {
  const struct = S.Object.strict(
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
    return S.parseOrThrow(struct, data);
  };
});

createCase('rescript-struct', 'assertLoose', () => {
  const struct = S.object({
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
    S.parseOrThrow(struct, data);

    return true;
  };
});

createCase('rescript-struct', 'assertStrict', () => {
  const struct = S.Object.strict(
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
    S.parseOrThrow(struct, data);

    return true;
  };
});
