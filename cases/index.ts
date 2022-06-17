export const cases = [
  'ajv',
  'bueno',
  'class-validator',
  'computed-types',
  'decoders',
  'deepkit',
  'io-ts',
  'jointz',
  'json-decoder',
  'marshal',
  'mojotech-json-type-validation',
  'myzod',
  'ok-computer',
  'purify-ts',
  'r-assign',
  'rulr',
  'runtypes',
  'simple-runtypes',
  'spectypes',
  'superstruct',
  'suretype',
  'toi',
  'ts-interface-checker',
  'ts-json-validator',
  'ts-utils',
  'tson',
  'typeofweb-schema',
  'valita',
  'yup',
  'zod',
] as const;

export type CaseName = typeof cases[number];

export async function importCase(caseName: CaseName) {
  await import('./' + caseName);
}
