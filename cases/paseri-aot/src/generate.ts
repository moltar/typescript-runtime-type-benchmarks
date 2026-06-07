import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import * as p from '@paseri/paseri';
import '@paseri/paseri/introspect';
import { toSource } from '@paseri/compiler';

// Schemas mirror the runtime `cases/paseri` case exactly so the two
// benchmarks validate identical shapes and the only difference measured is
// runtime parsing vs. the ahead-of-time compiled parser.
const dataTypeStrip = p
  .object({
    number: p.number(),
    negNumber: p.number(),
    maxNumber: p.number(),
    string: p.string(),
    longString: p.string(),
    boolean: p.boolean(),
    deeplyNested: p
      .object({
        foo: p.string(),
        num: p.number(),
        bool: p.boolean(),
      })
      .strip(),
  })
  .strip();

const dataTypeStrict = p
  .object({
    number: p.number(),
    negNumber: p.number(),
    maxNumber: p.number(),
    string: p.string(),
    longString: p.string(),
    boolean: p.boolean(),
    deeplyNested: p
      .object({
        foo: p.string(),
        num: p.number(),
        bool: p.boolean(),
      })
      .strict(),
  })
  .strict();

const dataTypePassthrough = p
  .object({
    number: p.number(),
    negNumber: p.number(),
    maxNumber: p.number(),
    string: p.string(),
    longString: p.string(),
    boolean: p.boolean(),
    deeplyNested: p
      .object({
        foo: p.string(),
        num: p.number(),
        bool: p.boolean(),
      })
      .passthrough(),
  })
  .passthrough();

// `toSource` emits a self-contained module per schema (its own imports and
// helpers), so each schema is written to its own file to avoid duplicate
// declarations that would result from concatenation.
const targets = [
  { schema: dataTypeStrip, name: 'DataTypeStrip', file: 'strip.ts' },
  { schema: dataTypeStrict, name: 'DataTypeStrict', file: 'strict.ts' },
  {
    schema: dataTypePassthrough,
    name: 'DataTypePassthrough',
    file: 'passthrough.ts',
  },
];

const outDir = join(process.cwd(), 'cases', 'paseri-aot', 'src', 'generated');
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const { schema, name, file } of targets) {
  const source = toSource(schema.toIR(), { name });
  writeFileSync(join(outDir, file), source);
}
