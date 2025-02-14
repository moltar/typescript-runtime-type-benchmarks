import { add, complete, cycle, suite } from 'benny';
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { writePreviewGraph } from './graph';
import { getRegisteredBenchmarks } from './register';
import type { BenchmarkCase, BenchmarkResult } from './types';

/**
 * A getDirname that works in CJS and ESM, since this file is directly shared
 * across both kinds of projects.
 * @TODO We can remove this once we've migrated all consumers to ESM.
 *
 * @see https://stackoverflow.com/a/79251101/13503626
 */
function pathFromStack() {
  const { stack } = new Error();
  if (!stack) {
    throw new Error('Could not get stack');
  }
  const lines = stack.split('\n');
  for (const line of lines) {
    if (line.includes(' (/') || line.includes(' (file://')) {
      // assumes UNIX-like paths
      const location = line.split(' (')[1].replace('file://', '');
      const filepath = location.split(':')[0];
      const dirpath = dirname(filepath);
      return { dirpath, filepath };
    }
  }
  throw new Error('Could not get dirname');
}

function getRuntimeWithVersion() {
  // @ts-expect-error no @types/bun
  if (typeof Bun !== 'undefined') {
    return { RUNTIME: 'bun', RUNTIME_VERSION: process.versions['bun']! };
  }

  // @ts-expect-error no Deno types
  if (typeof Deno !== 'undefined') {
    return { RUNTIME: 'deno', RUNTIME_VERSION: process.versions['deno']! };
  }

  return { RUNTIME: 'node', RUNTIME_VERSION: process.version };
}

const DOCS_DIR = join(pathFromStack().dirpath, '../../docs');
const { RUNTIME, RUNTIME_VERSION } = getRuntimeWithVersion();
const RUNTIME_FOR_PREVIEW = 'node';
const NODE_VERSION_FOR_PREVIEW = 20;

/**
 * Run all registered benchmarks and append the results to a file.
 */
export async function runAllBenchmarks() {
  const allResults: BenchmarkResult[] = [];

  for (const [benchmark, benchmarks] of getRegisteredBenchmarks()) {
    const summary = await runBenchmarks(benchmark, benchmarks);

    if (!summary) {
      continue;
    }

    summary.results.forEach(({ name, ops, margin }) => {
      allResults.push({
        benchmark,
        name,
        ops,
        margin,
        runtime: RUNTIME,
        runtimeVersion: RUNTIME_VERSION,
      });
    });
  }

  // collect results of isolated benchmark runs into a single file
  appendResults(allResults);
}

/**
 * Remove the results json file.
 */
export function deleteResults() {
  const fileName = resultsJsonFilename();

  if (existsSync(fileName)) {
    unlinkSync(fileName);
  }
}

/**
 * Generate the preview svg shown in the readme.
 */
export async function createPreviewGraph() {
  const majorVersion = getNodeMajorVersion();

  if (
    majorVersion === NODE_VERSION_FOR_PREVIEW &&
    RUNTIME_FOR_PREVIEW === 'node'
  ) {
    const allResults: BenchmarkResult[] = JSON.parse(
      readFileSync(resultsJsonFilename()).toString(),
    ).results;

    await writePreviewGraph({
      filename: previewSvgFilename(),
      values: allResults,
    });
  }
}

// run a benchmark fn with benny
async function runBenchmarks(name: string, cases: BenchmarkCase[]) {
  if (cases.length === 0) {
    return;
  }

  const fns = cases.map(c => add(c.moduleName, () => c.run()));

  return suite(
    name,

    // benchmark functions
    ...fns,

    cycle(),
    complete(),
  );
}

// append results to an existing file or create a new one
function appendResults(results: BenchmarkResult[]) {
  const fileName = resultsJsonFilename();

  const existingResults: BenchmarkResult[] = existsSync(fileName)
    ? JSON.parse(readFileSync(fileName).toString()).results
    : [];

  // check that we're appending unique data
  const getKey = ({
    benchmark,
    name,
    runtime,
    runtimeVersion,
  }: BenchmarkResult): string => {
    return JSON.stringify({ benchmark, name, runtime, runtimeVersion });
  };
  const existingResultsIndex = new Set(existingResults.map(r => getKey(r)));

  results.forEach(r => {
    if (existingResultsIndex.has(getKey(r))) {
      console.error('Result %s already exists in', getKey(r), fileName);

      throw new Error('Duplicate result in result json file');
    }
  });

  writeFileSync(
    fileName,

    JSON.stringify({
      results: [...existingResults, ...results],
    }),

    { encoding: 'utf8' },
  );
}

function resultsJsonFilename() {
  const majorVersion = getNodeMajorVersion();

  return join(DOCS_DIR, 'results', `${RUNTIME}-${majorVersion}.json`);
}

function previewSvgFilename() {
  return join(DOCS_DIR, 'results', 'preview.svg');
}

function getNodeMajorVersion() {
  // Hack for bun runtime to include major and minor version
  // like 1.2.3 -> 1.2
  if (RUNTIME === 'bun') {
    return parseFloat(RUNTIME_VERSION);
  }

  let majorVersion = 0;

  majorVersion = parseInt(RUNTIME_VERSION);

  if (!isNaN(majorVersion)) {
    return majorVersion;
  }

  majorVersion = parseInt(RUNTIME_VERSION.slice(1));

  if (!isNaN(majorVersion)) {
    return majorVersion;
  }

  return majorVersion;
}
