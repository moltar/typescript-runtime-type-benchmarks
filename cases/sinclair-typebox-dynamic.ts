import { createCase } from '../benchmarks/index.ts';
import { Value } from '@sinclair/typebox/value';
import { Loose, Strict } from './sinclair-typebox.ts';

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
