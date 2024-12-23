export const cases = [
  'aeria',
  'ajv',
  'arktype',
  'banditypes',
  'bueno',
  'caketype',
  'class-validator',
  'computed-types',
  'decoders',
  'io-ts',
  'jointz',
  'json-decoder',
  'mol_data',
  'mojotech-json-type-validation',
  'mondrian-framework',
  'myzod',
  'ok-computer',
  'parse-dont-validate',
  'pure-parse',
  'purify-ts',
  'paseri',
  'r-assign',
  'rescript-schema',
  'rulr',
  'runtypes',
  'sapphire-shapeshift',
  'simple-runtypes',
  'sinclair-typebox-ahead-of-time',
  'sinclair-typebox-dynamic',
  'sinclair-typebox-just-in-time',
  'spectypes',
  'succulent',
  'superstruct',
  'suretype',
  'tiny-schema-validator',
  'to-typed',
  'toi',
  'ts-interface-checker',
  'ts-json-validator',
  'ts-runtime-checks',
  'ts-utils',
  'tson',
  'typeofweb-schema',
  'typia',
  'unknownutil',
  'valibot',
  'valita',
  'vality',
  'yup',
  'zod',
  'deepkit',
  'effect-schema',
  'ts-auto-guard',
  'jet-schema',
] as const;

export type CaseName = (typeof cases)[number];

export async function importCase(caseName: CaseName) {
  try {
    await import(`./${caseName}.ts`);
  } catch {
    try {
      await import(`./${caseName}/index.ts`);
    } catch (e) {
      console.error(`Could not import ${caseName}.`, e);
    }
  }
}
