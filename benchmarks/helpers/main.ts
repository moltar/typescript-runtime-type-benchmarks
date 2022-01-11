import { add, complete, cycle, save, suite } from 'benny';
import stringify from 'csv-stringify/lib/sync';
import { readFileSync, writeFile, writeFileSync } from 'fs';
import { join } from 'path';
import pkg from '../../package.json';
import { graph } from './graph';
import { availableBenchmarks, getRegisteredBenchmarks } from './register';
import { BenchmarkCase, BenchmarkResult } from './types';

const RESULTS_DIR = join(__dirname, '../../results');
const DOCS_DIR = join(__dirname, '../../docs');
const NODE_VERSION = process.env.NODE_VERSION || process.version;

export async function main() {
  const majorVersion = getNodeMajorVersion();
  const allResults: BenchmarkResult[] = [];

  for (const [benchmark, benchmarks] of getRegisteredBenchmarks()) {
    const summary = await runBenchmarks(benchmark, benchmarks);

    summary.results.forEach(({ name, ops, margin }) => {
      allResults.push({
        benchmark,
        name,
        ops,
        margin,
        nodeVersion: NODE_VERSION,
      });
    });
  }

  writeFileSync(
    join(DOCS_DIR, 'results', `node-${majorVersion}.json`),

    JSON.stringify({
      results: allResults,
    }),

    { encoding: 'utf8' }
  );
}

async function runBenchmarks(name: string, cases: BenchmarkCase[]) {
  const fns = cases.map(c => add(c.moduleName, () => c.run()));

  return suite(
    name,

    // benchmark functions
    ...fns,

    cycle(),
    complete()
  );
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
