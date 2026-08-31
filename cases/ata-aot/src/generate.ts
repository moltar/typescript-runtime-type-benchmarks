import { mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { toStandaloneModule } from 'ata-validator/build';

// The schemas mirror the runtime `cases/ata` case exactly, so the only
// difference measured between the two entries is where the validator is
// built: at run time on first use, or here, before the program ships.
const looseSchema = {
  type: 'object',
  properties: {
    number: { type: 'number' },
    negNumber: { type: 'number' },
    maxNumber: { type: 'number' },
    string: { type: 'string' },
    longString: { type: 'string' },
    boolean: { type: 'boolean' },
    deeplyNested: {
      type: 'object',
      properties: {
        foo: { type: 'string' },
        num: { type: 'number' },
        bool: { type: 'boolean' },
      },
      required: ['foo', 'num', 'bool'],
    },
  },
  required: [
    'number',
    'negNumber',
    'maxNumber',
    'string',
    'longString',
    'boolean',
    'deeplyNested',
  ],
};

const strictSchema = JSON.parse(JSON.stringify(looseSchema));
strictSchema.additionalProperties = false;
strictSchema.properties.deeplyNested.additionalProperties = false;

// Each call emits a self-contained module with its own helpers, so the two
// schemas are written to separate files rather than concatenated.
const targets = [
  { schema: looseSchema, file: 'loose.js' },
  { schema: strictSchema, file: 'strict.js' },
];

const outDir = join(process.cwd(), 'cases', 'ata-aot', 'src', 'generated');
rmSync(outDir, { recursive: true, force: true });
mkdirSync(outDir, { recursive: true });

for (const { schema, file } of targets) {
  const source = toStandaloneModule(schema);
  if (typeof source !== 'string') {
    throw new Error(`ata could not compile ${file} ahead of time`);
  }
  writeFileSync(join(outDir, file), source);
}
