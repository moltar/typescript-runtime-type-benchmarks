import { add, complete, cycle, suite } from 'benny';
import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { writePreviewGraph } from './graph';
import { getRegisteredBenchmarks } from './register';
import { BenchmarkCase, BenchmarkResult } from './types';

const DOCS_DIR = join(__dirname, '../../docs');
const NODE_VERSION = process.env.NODE_VERSION || process.version;
const NODE_VERSION_FOR_PREVIEW = 17;
const TEST_PREVIEW_GENERATION = false;

export async function main() {
  if (TEST_PREVIEW_GENERATION) {
    // just generate the preview without using benchmark data from a previous run
    const allResults: BenchmarkResult[] = JSON.parse(
      readFileSync(join(DOCS_DIR, 'results', 'node-17.json')).toString()
    ).results;

    await writePreviewGraph({
      filename: join(DOCS_DIR, 'results', 'preview.svg'),
      values: allResults,
    });

    return;
  }

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

  if (majorVersion === NODE_VERSION_FOR_PREVIEW) {
    await writePreviewGraph({
      filename: join(DOCS_DIR, 'results', 'preview.svg'),
      values: allResults,
    });
  }
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
