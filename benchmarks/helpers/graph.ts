import { writeFileSync } from 'fs';
import { optimize } from 'svgo';
import { parse, View } from 'vega';
import { compile } from 'vega-lite';
import { availableBenchmarks, type AvailableBenchmarksIds } from './register';
import type { BenchmarkResult } from './types';

interface PreviewGraphParams {
  values: BenchmarkResult[];
  filename: string;
}

export async function writePreviewGraph(params: PreviewGraphParams) {
  const svg = await previewGraph(params);

  writeFileSync(params.filename, svg);
}

function assertNever(x: never): never {
  throw new Error(`assert-never: unknown value: ${x}`);
}

function getBenchmarkLabel(benchmark: AvailableBenchmarksIds) {
  switch (benchmark) {
    case 'assertLoose':
      return 'Loose Assertion';
    case 'assertStrict':
      return 'Strict Assertion';
    case 'parseSafe':
      return 'Safe Parsing';
    case 'parseStrict':
      return 'Strict Parsing';
    default:
      assertNever(benchmark);
  }
}

type BenchmarkLabel = ReturnType<typeof getBenchmarkLabel>;

function median(values: number[]) {
  if (!values.length) {
    return NaN;
  }

  if (values.length % 2) {
    return values[(values.length - 1) / 2];
  }

  return (values[values.length / 2 - 1] + values[values.length / 2]) / 2;
}

interface PreparedResult extends Partial<Record<BenchmarkLabel, number>> {
  name: string;
}

// Cheap aggregation of benchmark data.
// For the repeated bar chart, vega-lite expects a numeric value for each
// repeated field (the benchmark label) for each benchmarked library (`name`).
function prepareData(values: BenchmarkResult[], resultCountToInclude = 4) {
  const bins = new Map<string, BenchmarkResult[]>();

  values.forEach(result => {
    let bin = bins.get(result.benchmark);

    if (!bin) {
      bins.set(result.benchmark, []);
      bin = [];
    }

    bin.push(result);
  });

  const preparedResult: PreparedResult[] = [];

  function updateResult(
    name: string,
    benchmarkLabel: BenchmarkLabel,
    ops: number
  ) {
    const existing = preparedResult.find(v => v.name === name);

    if (existing) {
      existing[benchmarkLabel] = ops;
    } else {
      preparedResult.push({ name, [benchmarkLabel]: ops });
    }
  }

  bins.forEach(v => {
    if (!v.length) {
      throw new Error('no results in this bin');
    }

    const sorted = v.sort((a, b) => b.ops - a.ops);

    // the N fasted benchmarks
    sorted
      .slice(0, resultCountToInclude)
      .forEach(r =>
        updateResult(
          r.name,
          getBenchmarkLabel(r.benchmark as AvailableBenchmarksIds),
          r.ops
        )
      );
  });

  // add median last to make it appear at the bottom of each individual
  // barchart
  bins.forEach(v => {
    const sorted = v.sort((a, b) => b.ops - a.ops);

    // median of the rest as a comparison
    updateResult(
      '(median)',
      getBenchmarkLabel(v[0].benchmark as AvailableBenchmarksIds),
      median(sorted.map(x => x.ops))
    );
  });

  return preparedResult;
}

// generate a nice preview graph
async function previewGraph({ values }: PreviewGraphParams): Promise<string> {
  const vegaSpec = compile({
    repeat: Object.keys(availableBenchmarks).map(b =>
      getBenchmarkLabel(b as AvailableBenchmarksIds)
    ),
    columns: 2,
    title: {
      anchor: 'middle',
      offset: 20,
      text: 'Top 3 packages for each benchmark + median, (ops count, better ⯈)',
      fontWeight: 'normal',
      fontSize: 16,
    },
    spec: {
      data: {
        values: prepareData(values, 3),
      },
      height: { step: 15 },
      mark: 'bar',
      encoding: {
        x: {
          field: { repeat: 'repeat' },
          type: 'quantitative',
          sort: 'ascending',
        },
        y: {
          field: 'name',
          type: 'nominal',
          title: null,
          // do not sort by name to keep the preparedValues sorting by ops
          // instead
          // also, we cannot use `sort: '-x'` because that will include every
          // top 3 library in every repeated bar chart, regardless whether it
          // is in the top 3 of the current benchmark
          sort: null,
        },
        color: {
          field: 'name',
          type: 'nominal',
          legend: null,
          scale: { scheme: 'tableau10' },
        },
      },
    },
  });

  const view = new View(parse(vegaSpec.spec), { renderer: 'none' });
  const svg = await view.toSVG();

  const optimizeSvg = await optimize(svg, {
    js2svg: {
      pretty: true,
    },
  });

  return optimizeSvg.data;
}
