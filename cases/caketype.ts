import { bake, boolean, number, string } from 'caketype';
import { createCase } from '../benchmarks';

const cake = bake({
  number: number,
  negNumber: number,
  maxNumber: number,
  string: string,
  longString: string,
  boolean: boolean,
  deeplyNested: {
    foo: string,
    num: number,
    bool: boolean,
  },
});

// Safe parsing is not supported because extra keys are not removed from the input.

createCase('caketype', 'parseStrict', () => data => {
  if (cake.is(data)) {
    return data;
  }
  throw new Error();
});

createCase('caketype', 'assertLoose', () => data => {
  if (cake.isShape(data)) {
    return true;
  }
  throw new Error();
});

createCase('caketype', 'assertStrict', () => data => {
  if (cake.is(data)) {
    return true;
  }
  throw new Error();
});
