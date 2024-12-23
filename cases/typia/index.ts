import { is, equals, clone } from './build/index.js';
import { addCase } from '../../benchmarks/index.ts';

addCase('typia', 'parseSafe', data => {
  if (!is(data)) throw new Error('wrong type.');
  return clone(data);
});
addCase('typia', 'parseStrict', data => {
  if (!equals(data)) throw new Error('wrong type.');
  return data;
});
addCase('typia', 'assertStrict', data => {
  if (!equals(data)) throw new Error('wrong type.');
  return true;
});
addCase('typia', 'assertLoose', data => {
  if (!is(data)) throw new Error('wrong type.');
  return true;
});
