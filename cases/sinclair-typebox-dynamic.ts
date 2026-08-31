import { createCase } from '../benchmarks';
import { Value } from '@sinclair/typebox/value';
import { Loose, Strict } from './sinclair-typebox';

// Value.Parse is the first-class parse entry point: it clones, removes
// unknown keys and asserts in one call, returning a new typed object.
createCase('@sinclair/typebox-(dynamic)', 'parseSafe', () => {
  return data => {
    return Value.Parse(Loose, data);
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
