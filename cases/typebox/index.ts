import { TypeCompiler } from '@sinclair/typebox/compiler';
import type { TSchema } from '@sinclair/typebox';
import { Loose, Strict } from '../sinclair-typebox.ts';
import { writeFileSync } from 'node:fs';

// typebox assertion routines require a named shim before writing as modules
function CompileFunction<T extends TSchema>(name: string, schema: T): string {
  return `/* eslint-disable */ export const ${name} = (() => {${TypeCompiler.Code(
    schema,
    { language: 'typescript' },
  )}})();`;
}

// compiles the functions as string
const CheckLoose = CompileFunction('CheckLoose', Loose);
const CheckStrict = CompileFunction('CheckStrict', Strict);

// writes to disk. target directory read from argv, see npm script 'compile:typebox' for configuration
const target = process.argv[2];
writeFileSync(`${target}/check-loose.ts`, CheckLoose);
writeFileSync(`${target}/check-strict.ts`, CheckStrict);
