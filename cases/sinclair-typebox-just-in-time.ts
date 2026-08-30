import { createCase } from '../benchmarks';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { Value } from '@sinclair/typebox/value';
import { Loose, Strict } from './sinclair-typebox';

const CheckLoose = TypeCompiler.Compile(Loose);
const CheckStrict = TypeCompiler.Compile(Strict);

// TypeCompiler only compiles the check; removing unknown keys goes through
// the dynamic Value module, on a clone so the input is not mutated.
createCase('@sinclair/typebox-(just-in-time)', 'parseSafe', () => {
  return data => {
    if (!CheckLoose.Check(data)) {
      throw new Error('validation failure');
    }
    return Value.Clean(Loose, Value.Clone(data)) as typeof data;
  };
});
createCase('@sinclair/typebox-(just-in-time)', 'parseStrict', () => {
  return data => {
    if (!CheckStrict.Check(data)) {
      throw new Error('validation failure');
    }
    return data;
  };
});
createCase('@sinclair/typebox-(just-in-time)', 'assertLoose', () => {
  return data => {
    if (!CheckLoose.Check(data)) {
      throw new Error('validation failure');
    }
    return true;
  };
});
createCase('@sinclair/typebox-(just-in-time)', 'assertStrict', () => {
  return data => {
    if (!CheckStrict.Check(data)) {
      throw new Error('validation failure');
    }
    return true;
  };
});
