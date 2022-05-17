import { add, complete, cycle, suite } from 'benny';
import { readFileSync, writeFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';
import { writePreviewGraph } from './graph';
import { getRegisteredBenchmarks } from './register';
import { BenchmarkCase, BenchmarkResult } from './types';

const DOCS_DIR = join(__dirname, '../../docs');
const NODE_VERSION = process.env.NODE_VERSION || process.version;
const NODE_VERSION_FOR_PREVIEW = 17;
const TEST_PREVIEW_GENERATION = false;

/**
 * Run all registered benchmarks and append the results to a file.
 */
export async function runAllBenchmarks() {
  if (TEST_PREVIEW_GENERATION) {
    // during development: generate the preview using benchmark data from a previous run
    const allResults: BenchmarkResult[] = JSON.parse(
      readFileSync(join(DOCS_DIR, 'results', 'node-17.json')).toString()
    ).results;

    await writePreviewGraph({
      filename: previewSvgFilename(),
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

  if (majorVersion === NODE_VERSION_FOR_PREVIEW) {
    const allResults: BenchmarkResult[] = JSON.parse(
      readFileSync(resultsJsonFilename()).toString()
    ).results;

    await writePreviewGraph({
      filename: previewSvgFilename(),
      values: allResults,
    });
  }
}

// run a benchmark fn with benny
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
    nodeVersion,
  }: BenchmarkResult): string => {
    return JSON.stringify({ benchmark, name, nodeVersion });
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

    { encoding: 'utf8' }
  );
}

function resultsJsonFilename() {
  const majorVersion = getNodeMajorVersion();

  return join(DOCS_DIR, 'results', `node-${majorVersion}.json`);
}

function previewSvgFilename() {
  return join(DOCS_DIR, 'results', 'preview.svg');
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
