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
  const parseSafe = S.parser(schema);
  return data => {
    return parseSafe(data);
  };
});

createCase('sury', 'parseStrict', () => {
  const parseStrict = S.parser(S.deepStrict(schema));
  return data => {
    return parseStrict(data);
  };
});

createCase('sury', 'assertLoose', () => {
  const assertLoose = S.parser(
    schema,
    S.schema(true).with(S.noValidation, true),
  );
  return data => {
    return assertLoose(data);
  };
});

createCase('sury', 'assertStrict', () => {
  const assertStrict = S.parser(
    S.deepStrict(schema),
    S.schema(true).with(S.noValidation, true),
  );
  return data => {
    return assertStrict(data);
  };
});
