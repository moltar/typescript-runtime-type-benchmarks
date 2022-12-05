import * as S from 'rescript-struct';

import { createCase } from '../benchmarks';

createCase('rescript-struct', 'parseSafe', () => {
  const struct = S.object({
    number: S.number(),
    negNumber: S.number(),
    maxNumber: S.number(),
    string: S.string(),
    longString: S.string(),
    boolean: S.boolean(),
    deeplyNested: S.object({
      foo: S.string(),
      num: S.number(),
      bool: S.boolean(),
    }),
  });

  return data => {
    return struct.parseOrThrow(data);
  };
});

createCase('rescript-struct', 'parseStrict', () => {
  const struct = S.object({
    number: S.number(),
    negNumber: S.number(),
    maxNumber: S.number(),
    string: S.string(),
    longString: S.string(),
    boolean: S.boolean(),
    deeplyNested: S.object({
      foo: S.string(),
      num: S.number(),
      bool: S.boolean(),
    }).strict(),
  }).strict();

  return data => {
    return struct.parseOrThrow(data);
  };
});

createCase('rescript-struct', 'assertLoose', () => {
  const struct = S.object({
    number: S.number(),
    negNumber: S.number(),
    maxNumber: S.number(),
    string: S.string(),
    longString: S.string(),
    boolean: S.boolean(),
    deeplyNested: S.object({
      foo: S.string(),
      num: S.number(),
      bool: S.boolean(),
    }),
  });

  return data => {
    struct.parseOrThrow(data);

    return true;
  };
});

createCase('rescript-struct', 'assertStrict', () => {
  const struct = S.object({
    number: S.number(),
    negNumber: S.number(),
    maxNumber: S.number(),
    string: S.string(),
    longString: S.string(),
    boolean: S.boolean(),
    deeplyNested: S.object({
      foo: S.string(),
      num: S.number(),
      bool: S.boolean(),
    }).strict(),
  }).strict();

  return data => {
    struct.parseOrThrow(data);

    return true;
  };
});
