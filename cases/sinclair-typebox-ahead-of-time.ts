import { createCase } from '../benchmarks/index.ts';
import { CheckLoose } from './typebox/build/check-loose.ts';
import { CheckStrict } from './typebox/build/check-strict.ts';

createCase('@sinclair/typebox-(ahead-of-time)', 'assertLoose', () => {
  return data => {
    if (!CheckLoose(data)) {
      throw new Error('validation failure');
    }
    return true;
  };
});
createCase('@sinclair/typebox-(ahead-of-time)', 'assertStrict', () => {
  return data => {
    if (!CheckStrict(data)) {
      throw new Error('validation failure');
    }
    return true;
  };
});
