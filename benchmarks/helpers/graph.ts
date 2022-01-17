import { writeFileSync } from 'fs';
import { optimize } from 'svgo';
import { parse, View } from 'vega';
import { compile } from 'vega-lite';
import { availableBenchmarks, AvailableBenchmarksIds } from './register';
import { BenchmarkResult } from './types';

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

function getBenchmarkLabel(benchmark: AvailableBenchmarksIds): string {
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

function median(values: number[]) {
  if (!values.length) {
    return NaN;
  }

  if (values.length % 2) {
    return values[(values.length - 1) / 2];
  }

  return (values[values.length / 2 - 1] + values[values.length / 2]) / 2;
}

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

  const preparedResult: BenchmarkResult[] = [];

  bins.forEach(v => {
    if (!v.length) {
      throw new Error('no results in this bin');
    }

    const sorted = v.sort((a, b) => b.ops - a.ops);

    // the N fasted benchmarks
    preparedResult.push(
      ...sorted
        .slice(0, resultCountToInclude)
        .map(r => ({ ...r, color: 'fast' }))
    );

    // median of the rest as a comparison
    const rest = sorted.slice(resultCountToInclude);
    const others: BenchmarkResult = {
      benchmark: v[0].benchmark,
      margin: 0,
      name: '... rest',
      nodeVersion: v[0].nodeVersion,
      ops: median(rest.map(x => x.ops)),
    };

    preparedResult.push(others);
  });

  return preparedResult.map(v => {
    return {
      ...v,
      [getBenchmarkLabel(v.benchmark as AvailableBenchmarksIds)]: v.ops,
    };
  });
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
      text: 'Top 3 packages for each benchmark',
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
        y: { field: 'name', type: 'nominal', title: null },
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
