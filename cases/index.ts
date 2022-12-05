export const cases = [
  'ajv',
  'bueno',
  'class-validator',
  'computed-types',
  'decoders',
  'io-ts',
  'jointz',
  'json-decoder',
  'marshal',
  'mojotech-json-type-validation',
  'myzod',
  'ok-computer',
  'parse-dont-validate',
  'purify-ts',
  'r-assign',
  'rescript-struct',
  'rulr',
  'runtypes',
  'sapphire-shapeshift',
  'simple-runtypes',
  'sinclair-typebox',
  'spectypes',
  'superstruct',
  'suretype',
  'to-typed',
  'toi',
  'ts-interface-checker',
  'ts-json-validator',
  'ts-runtime-checks',
  'ts-utils',
  'tson',
  'typeofweb-schema',
  'valita',
  'vality',
  'yup',
  'zod',
] as const;

export type CaseName = typeof cases[number];

export async function importCase(caseName: CaseName) {
  await import('./' + caseName);
}
