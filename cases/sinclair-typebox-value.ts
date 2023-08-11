import { createCase } from '../benchmarks';
import { Value } from '@sinclair/typebox/value';
import { Loose, Strict } from './sinclair-typebox';

createCase('@sinclair/typebox-value', 'assertLoose', () => {
  return data => {
    if (!Value.Check(Loose, data)) {
      throw new Error('validation failure');
    }
    return true;
  };
});
createCase('@sinclair/typebox-value', 'assertStrict', () => {
  return data => {
    if (!Value.Check(Strict, data)) {
      throw new Error('validation failure');
    }
    return true;
  };
});
