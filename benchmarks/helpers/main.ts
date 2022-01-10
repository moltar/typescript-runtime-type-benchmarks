import { add, complete, cycle, save, suite } from 'benny';
import stringify from 'csv-stringify/lib/sync';
import { readFileSync, writeFile, writeFileSync } from 'fs';
import { join } from 'path';
import pkg from '../../package.json';
import { graph } from './graph';
import { availableBenchmarks, getRegisteredBenchmarks } from './register';
import { BenchmarkCase } from './types';

const RESULTS_DIR = join(__dirname, '../../results');
const DOCS_DIR = join(__dirname, '../../docs');
const NODE_VERSION = process.env.NODE_VERSION || process.version;

export async function main() {
  for (const [benchmarkKey, benchmarks] of getRegisteredBenchmarks()) {
    await runBenchmarks(benchmarkKey, benchmarks);
  }

  aggregateResults();
}

async function runBenchmarks(name: string, cases: BenchmarkCase[]) {
  const fns = cases.map(c => add(c.moduleName, () => c.run()));

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
      const csvFilename = join(RESULTS_DIR, getResultFileName(name, '.csv'));
      await saveFile(csvFilename, csv);

      const svg = await graph(csvFilename);
      const svgFilename = join(RESULTS_DIR, getResultFileName(name, '.svg'));
      await saveFile(svgFilename, svg);
    }),

    // saves raw JSON results
    save({
      file: getResultFileName(name, ''),
      folder: RESULTS_DIR,
      version: pkg.version,
    })
  );
}

function saveFile(filename: string, content: string) {
  return new Promise<void>((resolve, reject) => {
    return writeFile(filename, content, { encoding: 'utf8' }, err =>
      err ? reject(err) : resolve()
    );
  });
}

function getResultFileName(
  benchmarkName: string,
  suffix: '.json' | '.svg' | '.csv' | ''
) {
  return `${benchmarkName}-${NODE_VERSION}${suffix}`;
}

function getNodeMajorVersion() {
  let majorVersion = 0;

  majorVersion = parseInt(NODE_VERSION);

  if (!isNaN(majorVersion)) {
    return majorVersion;
  }

  majorVersion = parseInt(NODE_VERSION.slice(1));

  if (!isNaN(majorVersion)) {
    return majorVersion;
  }

  return majorVersion;
}

// combine all benchmarks into a single file for this node version
function aggregateResults() {
  const majorVersion = getNodeMajorVersion();

  const results: {
    name: string;
    benchmark: string;
    nodeVersion: string;
    ops: number;
    margin: number;
  }[] = [];

  Object.keys(availableBenchmarks).forEach(name => {
    const data = JSON.parse(
      readFileSync(
        join(RESULTS_DIR, getResultFileName(name, '.json'))
      ).toString()
    );

    data.results.forEach(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (r: any) =>
        results.push({
          name: r.name,
          benchmark: name,
          nodeVersion: NODE_VERSION,
          ops: r.ops,
          margin: r.margin,
        })
    );
  });

  writeFileSync(
    join(DOCS_DIR, 'results', `node-${majorVersion}.json`),

    JSON.stringify({
      results,
    })
  );
}
