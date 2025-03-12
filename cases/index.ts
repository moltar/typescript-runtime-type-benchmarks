export const cases = [
  'aeria',
  'ajv',
  'arktype',
  'banditypes',
  'bueno',
  'caketype',
  'class-validator',
  'cleaners',
  'computed-types',
  'decoders',
  'io-ts',
  'joi',
  'jointz',
  'json-decoder',
  'mol_data',
  'mojotech-json-type-validation',
  'mondrian-framework',
  'myzod',
  'ok-computer',
  'parse-dont-validate',
  'paseri',
  'pure-parse',
  'purify-ts',
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
  'stnl',
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
  'type-predicate-generator',
  'jet-validators',
] as const;

export type CaseName = (typeof cases)[number];

export async function importCase(caseName: CaseName) {
  await import('./' + caseName);
}
