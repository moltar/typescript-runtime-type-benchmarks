import { Component, Fragment, h, render } from 'preact';
import * as vegaLite from 'vega-lite';
import * as vega from 'vega';

const NODE_VERSIONS = [12, 14, 16, 17];

interface BenchmarkResult {
  name: string;
  benchmark: string;
  nodeVersion: string;
  ops: number;
  margin: number;
}

// colors taken from https://colorbrewer2.org/?type=qualitative&scheme=Set3&n=12
const COLORS = [
  '#8dd3c7',
  '#ffffb3',
  '#bebada',
  '#fb8072',
  '#80b1d3',
  '#fdb462',
  '#b3de69',
  '#fccde5',
  '#d9d9d9',
  '#bc80bd',
  '#ccebc5',
  '#ffed6f',
];

// create a stable color list
const BENCHMARKS = [
  { name: 'validate', label: 'Safe Validation', color: COLORS[0], order: '0' },
  {
    name: 'validateStrict',
    label: 'Strict Validation',
    color: COLORS[4],
    order: '1',
  },
  {
    name: 'validateLoose',
    label: 'Unsafe Validation',
    color: COLORS[1],
    order: '2',
  },
];
const BENCHMARKS_ORDER = Object.fromEntries(
  BENCHMARKS.map((b, idx) => [b.name, b.order])
);

function normalizePartialValues(values: BenchmarkResult[]): BenchmarkResult[] {
  if (!values.length) {
    return [];
  }

  const nodeVersion = values[0].nodeVersion;

  if (!values.every(v => v.nodeVersion === nodeVersion)) {
    throw new Error('normalizeValues: expected same node version on results');
  }

  const existingValues: { [name: string]: BenchmarkResult[] } = {};

  values.forEach(r => {
    if (existingValues[r.name]) {
      existingValues[r.name].push(r);
    } else {
      existingValues[r.name] = [r];
    }
  });

  const normalized: BenchmarkResult[] = [];

  Object.entries(existingValues).forEach(([name, results]) => {
    normalized.push(...results);

    const missingBenchmarks = BENCHMARKS.map(b => b.name).filter(
      n => !results.find(r => r.name === n)
    );

    missingBenchmarks.forEach(benchmark => {
      normalized.push({
        benchmark,
        name,
        margin: 0,
        nodeVersion,
        ops: 0,
      });
    });
  });

  return normalized;
}

async function graph(
  selectedBenchmarks: typeof BENCHMARKS,
  values: BenchmarkResult[]
) {
  const selectedBenchmarkIndex = new Map(
    selectedBenchmarks.map(b => [b.name, b])
  );

  const vegaSpec = vegaLite.compile({
    data: {
      values: values
        .filter(b => selectedBenchmarkIndex.has(b.benchmark))
        .map(b => ({
          ...b,
          benchmark: `${BENCHMARKS_ORDER[b.benchmark]}-${b.benchmark}`,
        })),
    },
    width: 600,
    height: { step: 15 },
    mark: 'bar',
    encoding: {
      row: {
        field: 'name',
        type: 'nominal',
        title: null,
        spacing: 0,
        header: {
          labelAngle: 0,
          labelOrient: 'left',
          labelAnchor: 'middle',
          labelAlign: 'left',
        },
      },
      x: {
        field: 'ops',
        type: 'quantitative',
        title: ['operations / sec', '(better ⯈)'],
        axis: {
          orient: 'top',
          offset: 10,
          labelFontSize: 12,
          titleFontSize: 14,
          titleFontWeight: 'normal',
        },
      },
      y: {
        field: 'benchmark',
        type: 'nominal',
        title: 'Benchmark',
        axis: null,
      },
      color: {
        field: 'benchmark',
        type: 'nominal',
        legend: null,
        scale: {
          range: selectedBenchmarks.map(b => b.color),
        },
      },
    },
  });

  const view = new vega.View(vega.parse(vegaSpec.spec), { renderer: 'none' });

  const svg = await view.toSVG();

  return svg;
}

class Graph extends Component<
  { benchmarks: typeof BENCHMARKS; values: BenchmarkResult[] },
  { svg?: string }
> {
  prevProps: any;

  async createGraph() {
    if (this.prevProps === this.props) {
      return;
    }

    this.prevProps = this.props;
    this.setState({
      svg: await graph(this.props.benchmarks, this.props.values),
    });
  }

  render() {
    this.createGraph();

    return (
      <div
        style={{ height: '650px' }}
        dangerouslySetInnerHTML={{ __html: this.state.svg }}
      />
    );
  }
}

function Checkbox(props: {
  id: string;
  label: string;
  color: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div style={{ display: 'flex', backgroundColor: props.color }}>
      <input
        id={props.id}
        type="checkbox"
        name={props.id}
        checked={props.checked}
        onInput={() => props.onChange(!props.checked)}
      />
      <label style={{ width: '100%' }} for={props.id}>
        {props.label}
      </label>
    </div>
  );
}

class App extends Component<
  {},
  {
    selectedBenchmarks: { [key: string]: boolean };
    values: BenchmarkResult[];
  }
> {
  state = {
    selectedBenchmarks: BENCHMARKS.reduce(
      (acc, b) => ({ ...acc, [b.name]: true }),
      {}
    ),
    values: [],
  };

  componentDidMount() {
    NODE_VERSIONS.forEach(v => {
      fetch(`results/node-${v}.json`)
        .then(response => response.json())
        .then(data => {
          this.setState(state => ({
            ...state,
            values: [...state.values, ...normalizePartialValues(data.results)],
          }));
        })
        .catch(err => {
          console.info(`no data for node ${v}`);
        });
    });
  }

  render() {
    return (
      <div>
        <h1>Runtype Benchmarks</h1>
        <p>
          Benchmark Comparison of Packages with Runtime Validation and
          TypeScript Support
        </p>

        <div style={{ display: 'flex', margin: '1rem 0' }}>
          <div style={{ width: '33%' }}>
            <label>Benchmarks:</label>
            <div>
              {BENCHMARKS.map(b => {
                return (
                  <Checkbox
                    id={b.name}
                    color={b.color}
                    checked={this.state.selectedBenchmarks[b.name] ?? false}
                    label={b.label}
                    onChange={checked =>
                      this.setState(state => ({
                        ...state,
                        selectedBenchmarks: {
                          ...this.state.selectedBenchmarks,
                          [b.name]: checked,
                        },
                      }))
                    }
                  />
                );
              })}
            </div>
          </div>
        </div>

        <Graph
          benchmarks={BENCHMARKS.filter(
            b => this.state.selectedBenchmarks[b.name]
          )}
          values={this.state.values}
        />
      </div>
    );
  }
}

render(<App />, document.body);
