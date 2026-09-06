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
    name: 'ata',
    packageName: 'ata-validator',
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
  {
    name: '@sx3/gate',
    packageName: '@sx3/gate',
  },
] as const;

interface BodyWeeklyDownloads {
  downloads: number;
  start: Date;
  end: Date;
  package: string;
}

const NPM_API_URL = 'https://api.npmjs.org/downloads/point/last-week';
const RETRY_DELAYS_MS = [1000, 5000, 15000];

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// the npm api sits behind a rate limiter that rejects rapid request bursts, so retry with backoff instead of giving up
async function requestWithRetry(url: string): Promise<unknown> {
  for (let attempt = 0; ; attempt++) {
    try {
      const response = await request(url);

      if (response.statusCode !== 200) {
        const body = await response.body.text();

        throw new Error(`HTTP ${response.statusCode}: ${body}`);
      }

      return await response.body.json();
    } catch (error) {
      if (attempt >= RETRY_DELAYS_MS.length) {
        throw error;
      }

      console.error(`Retrying ${url} after error:`, error);

      await sleep(RETRY_DELAYS_MS[attempt]);
    }
  }
}

async function getWeeklyDownloadsByPackage(): Promise<Map<string, number>> {
  const packageNames = [...new Set(packages.map(p => p.packageName))];
  const scoped = packageNames.filter(name => name.startsWith('@'));
  const unscoped = packageNames.filter(name => !name.startsWith('@'));

  const downloads = new Map<string, number>();

  // bulk queries don't support scoped packages
  console.log(`Downloading ${unscoped.length} unscoped packages in bulk`);

  const bulk = (await requestWithRetry(
    `${NPM_API_URL}/${unscoped.join(',')}`,
  )) as { [packageName: string]: BodyWeeklyDownloads | null };

  for (const name of unscoped) {
    const entry = bulk[name];

    if (entry) {
      downloads.set(name, entry.downloads);
    }
  }

  for (const name of scoped) {
    console.log(`Downloading ${name}`);

    const entry = (await requestWithRetry(
      `${NPM_API_URL}/${name}`,
    )) as BodyWeeklyDownloads;

    downloads.set(name, entry.downloads);

    await sleep(500);
  }

  return downloads;
}

async function main() {
  const downloads = await getWeeklyDownloadsByPackage();

  const packagesData = packages.map(({ name, packageName }) => {
    const weeklyDownloads = downloads.get(packageName);

    // fail the run rather than silently publishing a file with packages missing
    if (typeof weeklyDownloads !== 'number') {
      throw new Error(`No weekly downloads found for ${packageName}`);
    }

    return { name, weeklyDownloads };
  });

  fs.writeFileSync(
    './docs/packagesPopularity.json',
    JSON.stringify(packagesData),
  );
}

main().catch(error => {
  console.error('Error:', error);
  process.exitCode = 1;
});
