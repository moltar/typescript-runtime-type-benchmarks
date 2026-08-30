import { createCase } from '../benchmarks';
import { Value } from '@sinclair/typebox/value';
import { Loose, Strict } from './sinclair-typebox';

// Value.Clean removes unknown keys; it runs on a clone so the input is not
// mutated and the case returns a new object.
createCase('@sinclair/typebox-(dynamic)', 'parseSafe', () => {
  return data => {
    if (!Value.Check(Loose, data)) {
      throw new Error('validation failure');
    }
    return Value.Clean(Loose, Value.Clone(data)) as typeof data;
  };
});
createCase('@sinclair/typebox-(dynamic)', 'parseStrict', () => {
  return data => {
    if (!Value.Check(Strict, data)) {
      throw new Error('validation failure');
    }
    return data;
  };
});
createCase('@sinclair/typebox-(dynamic)', 'assertLoose', () => {
  return data => {
    if (!Value.Check(Loose, data)) {
      throw new Error('validation failure');
    }
    return true;
  };
});
createCase('@sinclair/typebox-(dynamic)', 'assertStrict', () => {
  return data => {
    if (!Value.Check(Strict, data)) {
      throw new Error('validation failure');
    }
    return true;
  };
});
