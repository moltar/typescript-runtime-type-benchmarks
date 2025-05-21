import fs from 'node:fs';
import { request } from 'undici';

export const packages = [
  {
    name: 'aeria',
    packageName: '@aeriajs/validation',
  },
  {
    name: 'ajv',
    packageName: 'ajv',
  },
  {
    name: 'arktype',
    packageName: 'arktype',
  },
  {
    name: 'banditypes',
    packageName: 'banditypes',
  },
  {
    name: 'bueno',
    packageName: 'bueno',
  },
  {
    name: 'caketype',
    packageName: 'caketype',
  },
  {
    name: 'class-transformer-validator-sync',
    packageName: 'class-validator',
  },
  {
    name: 'computed-types',
    packageName: 'computed-types',
  },
  {
    name: 'decoders',
    packageName: 'decoders',
  },
  {
    name: 'io-ts',
    packageName: 'io-ts',
  },
  {
    name: 'jointz',
    packageName: 'jointz',
  },
  {
    name: 'json-decoder',
    packageName: 'json-decoder',
  },
  {
    name: '$mol_data',
    packageName: 'mol_data_all',
  },
  {
    name: '@mojotech/json-type-validation',
    packageName: '@mojotech/json-type-validation',
  },
  {
    name: 'mondrian-framework',
    packageName: '@mondrian-framework/model',
  },
  {
    name: 'myzod',
    packageName: 'myzod',
  },
  {
    name: 'ok-computer',
    packageName: 'ok-computer',
  },
  {
    name: 'parse-dont-validate (chained function)',
    packageName: 'parse-dont-validate',
  },
  {
    name: 'parse-dont-validate (named parameters)',
    packageName: 'parse-dont-validate',
  },
  {
    name: 'purify-ts',
    packageName: 'purify-ts',
  },
  {
    name: 'r-assign',
    packageName: 'r-assign',
  },
  {
    name: 'rescript-schema',
    packageName: 'rescript-schema',
  },
  {
    name: 'rulr',
    packageName: 'rulr',
  },
  {
    name: 'runtypes',
    packageName: 'runtypes',
  },
  {
    name: '@sapphire/shapeshift',
    packageName: '@sapphire/shapeshift',
  },
  {
    name: 'simple-runtypes',
    packageName: 'simple-runtypes',
  },
  {
    name: '@sinclair/typebox-(ahead-of-time)',
    packageName: '@sinclair/typebox',
  },
  {
    name: '@sinclair/typebox-(dynamic)',
    packageName: '@sinclair/typebox',
  },
  {
    name: '@sinclair/typebox-(just-in-time)',
    packageName: '@sinclair/typebox',
  },
  {
    name: 'spectypes',
    packageName: 'spectypes',
  },
  {
    name: 'succulent',
    packageName: 'succulent',
  },
  {
    name: 'superstruct',
    packageName: 'superstruct',
  },
  {
    name: 'suretype',
    packageName: 'suretype',
  },
  {
    name: 'sury',
    packageName: 'sury',
  },
  {
    name: 'tiny-schema-validator',
    packageName: 'tiny-schema-validator',
  },
  {
    name: 'to-typed',
    packageName: 'to-typed',
  },
  {
    name: 'toi',
    packageName: '@toi/toi',
  },
  {
    name: 'ts-interface-checker',
    packageName: 'ts-interface-checker',
  },
  {
    name: 'ts-json-validator',
    packageName: 'ts-json-validator',
  },
  {
    name: 'ts-runtime-checks',
    packageName: 'ts-runtime-checks',
  },
  {
    name: 'ts-utils',
    packageName: '@ailabs/ts-utils',
  },
  {
    name: 'tson',
    packageName: '@skarab/tson',
  },
  {
    name: '@typeofweb/schema',
    packageName: '@typeofweb/schema',
  },
  {
    name: 'typia',
    packageName: 'typia',
  },
  {
    name: 'unknownutil',
    packageName: 'unknownutil',
  },
  {
    name: 'valibot',
    packageName: 'valibot',
  },
  {
    name: 'valita',
    packageName: '@badrap/valita',
  },
  {
    name: 'vality',
    packageName: 'vality',
  },
  {
    name: 'yup',
    packageName: 'yup',
  },
  {
    name: 'zod',
    packageName: 'zod',
  },
  {
    name: 'deepkit',
    packageName: '@deepkit/core',
  },
  {
    name: 'effect-schema',
    packageName: '@effect/schema',
  },
  {
    name: 'ts-auto-guard',
    packageName: 'ts-auto-guard',
  },
  {
    name: 'type-predicate-generator',
    packageName: 'type-predicate-generator',
  },
  {
    name: 'joi',
    packageName: 'joi',
  },
] as const;

interface BodyWeeklyDownloads {
  downloads: number;
  start: Date;
  end: Date;
  package: string;
}

async function getWeeklyDownloads(packageName: string) {
  try {
    const response = await request(
      `https://api.npmjs.org/downloads/point/last-week/${packageName}`,
    ).then(response => response.body.json() as Promise<BodyWeeklyDownloads>);

    return response.downloads;
  } catch (error) {
    console.error('Error fetching download data:', error);
  }
}

const packagesData: {
  name: string;
  weeklyDownloads: number;
}[] = [];

async function main() {
  for (const { name, packageName } of packages) {
    console.log(`Downloading ${name}`);

    const weeklyDownloads = await getWeeklyDownloads(packageName);

    if (typeof weeklyDownloads !== 'number') {
      console.error(`No weekly downloads found for ${packageName}`);

      continue;
    }

    packagesData.push({
      name,
      weeklyDownloads,
    });
  }

  fs.writeFileSync(
    './docs/packagesPopularity.json',
    JSON.stringify(packagesData),
  );
}

main().catch(error => {
  console.error('Error:', error);
});
