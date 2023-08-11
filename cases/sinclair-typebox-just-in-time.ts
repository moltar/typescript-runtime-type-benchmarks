import { createCase } from '../benchmarks';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { Loose, Strict } from './sinclair-typebox';

const CheckLoose = TypeCompiler.Compile(Loose);
const CheckStrict = TypeCompiler.Compile(Strict);

createCase('@sinclair/typebox-just-in-time', 'assertLoose', () => {
  return data => {
    if (!CheckLoose.Check(data)) {
      throw new Error('validation failure');
    }
    return true;
  };
});
createCase('@sinclair/typebox-just-in-time', 'assertStrict', () => {
  return data => {
    if (!CheckStrict.Check(data)) {
      throw new Error('validation failure');
    }
    return true;
  };
});
