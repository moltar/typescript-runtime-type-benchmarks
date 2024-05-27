import { Schema } from '@effect/schema';
import { createCase } from '../benchmarks';

createCase('effect-schema', 'parseSafe', () => {
  const dataType = Schema.Struct({
    number: Schema.Number,
    negNumber: Schema.Number,
    maxNumber: Schema.Number,
    string: Schema.String,
    longString: Schema.String,
    boolean: Schema.Boolean,
    deeplyNested: Schema.Struct({
      foo: Schema.String,
      num: Schema.Number,
      bool: Schema.Boolean,
    }),
  });

  const parse = Schema.decodeUnknownSync(dataType, {
    onExcessProperty: undefined,
  });

  return data => {
    return parse(data);
  };
});

createCase('effect-schema', 'parseStrict', () => {
  const dataType = Schema.Struct({
    number: Schema.Number,
    negNumber: Schema.Number,
    maxNumber: Schema.Number,
    string: Schema.String,
    longString: Schema.String,
    boolean: Schema.Boolean,
    deeplyNested: Schema.Struct({
      foo: Schema.String,
      num: Schema.Number,
      bool: Schema.Boolean,
    }),
  });

  const parse = Schema.decodeUnknownSync(dataType, {
    onExcessProperty: 'error',
  });

  return data => {
    return parse(data);
  };
});

createCase('effect-schema', 'assertLoose', () => {
  const dataType = Schema.Struct({
    number: Schema.Number,
    negNumber: Schema.Number,
    maxNumber: Schema.Number,
    string: Schema.String,
    longString: Schema.String,
    boolean: Schema.Boolean,
    deeplyNested: Schema.Struct({
      foo: Schema.String,
      num: Schema.Number,
      bool: Schema.Boolean,
    }),
  });

  const asserts = Schema.asserts(dataType, {
    onExcessProperty: 'ignore',
  });

  return data => {
    asserts(data)!;
    return true;
  };
});

createCase('effect-schema', 'assertStrict', () => {
  const dataType = Schema.Struct({
    number: Schema.Number,
    negNumber: Schema.Number,
    maxNumber: Schema.Number,
    string: Schema.String,
    longString: Schema.String,
    boolean: Schema.Boolean,
    deeplyNested: Schema.Struct({
      foo: Schema.String,
      num: Schema.Number,
      bool: Schema.Boolean,
    }),
  });

  const validate = Schema.asserts(dataType, {
    onExcessProperty: 'error',
  });

  return data => {
    validate(data)!;
    return true;
  };
});
