import { writeFile } from 'fs';
import { join } from 'path';
import { suite, add, cycle, complete, save } from 'benny';
import stringify from 'csv-stringify/lib/sync';
import pkg from './package.json';
import { graph } from './graph';
import { DATA } from './data';
import { cases } from './cases';
import { Case } from './cases/abstract';
import { TsJsonValidatorCase } from './cases/ts-json-validator';
import { MarshalCase } from './cases/marshal';

const caseInstances: Case[] = cases.map(caseClass => new caseClass(DATA));

const RESULTS_DIR = join(__dirname, 'results');
const NODE_VERSION = process.env.NODE_VERSION || process.version;

async function main() {
  await suiteDataTypeValidation();
  await suiteDataTypeValidationSansOutliers();
}
main();

/**
 * Benchmarking suite that performs data type validation only.
 *
 * https://en.wikipedia.org/wiki/Data_validation#Data-type_check
 */
async function suiteDataTypeValidation() {
  await run('data-type', caseInstances, 'validate');
}

/**
 * Benchmarking suite that performs data type validation only, but skips outliers
 * because it is difficult to look at the performance of other packages.
 *
 * https://en.wikipedia.org/wiki/Data_validation#Data-type_check
 */
async function suiteDataTypeValidationSansOutliers() {
  const cases = caseInstances
    .filter(caseInstance => !(caseInstance instanceof MarshalCase))
    .filter(caseInstance => !(caseInstance instanceof TsJsonValidatorCase));

  await run('data-type-sans-outliers', cases, 'validate');
}

async function run(name: string, cases: Case[], methodName: keyof Case) {
  const fns = cases.map(caseInstance =>
    add(caseInstance.name, () => {
      const method = caseInstance[methodName];

      if (typeof method === 'function') {
        return method.bind(caseInstance)();
      } else {
        throw new Error(`${methodName} is not a callable method.`);
      }
    })
  );

  return suite(
    name,

    // benchmark functions
    ...fns,

    cycle(),
    complete(),

    // saves CSV and SVG
    complete(async res => {
      const csvArr = res.results.map(({ name, ops }) => {
        return { name, ops };
      });

      const csv = stringify(csvArr, {
        header: true,
        columns: ['name', 'ops'],
      });
      const csvFilename = join(RESULTS_DIR, `${name}-${NODE_VERSION}.csv`);
      await saveFile(csvFilename, csv);

      const svg = await graph(csvFilename);
      const svgFilename = join(RESULTS_DIR, `${name}-${NODE_VERSION}.svg`);
      await saveFile(svgFilename, svg);
    }),

    // saves raw JSON results
    save({
      file: `${name}-${NODE_VERSION}`,
      folder: RESULTS_DIR,
      version: pkg.version,
    })
  );
}

function saveFile(filename: string, content: string) {
  return new Promise((resolve, reject) => {
    return writeFile(filename, content, { encoding: 'utf8' }, err =>
      err ? reject(err) : resolve()
    );
  });
}
