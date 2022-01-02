import { Component, Fragment, h, render } from 'preact';
import * as vegaLite from 'vega-lite';
import * as vega from 'vega';

// which results are attempted to load
// the first is selected automatically
const NODE_VERSIONS = [17, 16, 14, 12];

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
  // '#ffffb3', not this one .. looks to bright to me
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
    color: COLORS[1],
    order: '1',
  },
  {
    name: 'validateLoose',
    label: 'Unsafe Validation',
    color: COLORS[2],
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

function getNodeMajorVersionNumber(nodeVersion: string): number {
  const match = nodeVersion.match(/v([0-9]+)\./);

  return parseInt(match[1]);
}

async function graph(
  selectedBenchmarks: typeof BENCHMARKS,
  selectedNodeJsVersions: string[],
  benchmarkResults: BenchmarkResult[]
) {
  const selectedBenchmarkSet = new Set(selectedBenchmarks.map(b => b.name));
  const selectedNodeJsVersionsSet = new Set(selectedNodeJsVersions);

  const values = benchmarkResults
    .filter(
      b =>
        selectedBenchmarkSet.has(b.benchmark) &&
        selectedNodeJsVersionsSet.has(b.nodeVersion)
    )
    .map(b => ({
      ...b,
      // artificical benchmark name to make sure its always sorted by
      // benchmark and node-version
      benchmark: [
        BENCHMARKS_ORDER[b.benchmark],
        NODE_VERSIONS.indexOf(getNodeMajorVersionNumber(b.nodeVersion)),
        b.nodeVersion,
        b.benchmark,
      ].join('-'),
    }));

  const nodeJsVersionCount = new Set(values.map(v => v.nodeVersion)).size;

  // build a color map so that each benchmark has the same color in different
  // node-versions
  const colorScaleRange = [];

  selectedBenchmarks.forEach(b => {
    for (let i = 0; i < nodeJsVersionCount; i++) {
      colorScaleRange.push(b.color);
    }
  });

  const vegaSpec = vegaLite.compile({
    data: {
      values,
    },
    width: 600,
    height: { step: 15 / nodeJsVersionCount },
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
        axis: null, // to debug the bars: axis: {labelFontSize: 3},
      },
      color: {
        field: 'benchmark',
        type: 'nominal',
        legend: null,
        scale: {
          range: colorScaleRange,
        },
      },
    },
  });

  const view = new vega.View(vega.parse(vegaSpec.spec), { renderer: 'none' });
  const svg = await view.toSVG();

  return svg;
}

class Graph extends Component<
  {
    benchmarks: typeof BENCHMARKS;
    nodeJsVersions: string[];
    values: BenchmarkResult[];
  },
  { svg?: string }
> {
  prevProps: any;

  async createGraph() {
    if (this.prevProps === this.props) {
      return;
    }

    this.prevProps = this.props;
    this.setState({
      svg: await graph(
        this.props.benchmarks,
        this.props.nodeJsVersions,
        this.props.values
      ),
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
  color?: string;
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
    selectedNodeJsVersions: { [key: string]: boolean };
    values: BenchmarkResult[];
  }
> {
  state = {
    selectedBenchmarks: BENCHMARKS.reduce(
      (acc, b) => ({ ...acc, [b.name]: true }),
      {}
    ),
    selectedNodeJsVersions: {},
    values: [],
  };

  getNodeJsVersions() {
    const versionsSet = new Set(this.state.values.map(v => v.nodeVersion));
    const res: string[] = [];

    versionsSet.forEach(v => res.push(v));

    return res;
  }

  componentDidMount() {
    NODE_VERSIONS.forEach((v, i) => {
      fetch(`results/node-${v}.json`)
        .then(response => response.json())
        .then(data => {
          this.setState(state => ({
            ...state,

            // select the first node versions benchmark automatically
            selectedNodeJsVersions:
              i === 0
                ? {
                    ...state.selectedNodeJsVersions,
                    [data.results[0].nodeVersion]: true,
                  }
                : state.selectedNodeJsVersions,

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
          <div style={{ width: '12rem', marginRight: '1rem' }}>
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

          <div style={{ width: '12rem' }}>
            <label>Node.js Versions:</label>
            <div>
              {this.getNodeJsVersions().map(v => {
                return (
                  <Checkbox
                    id={v}
                    checked={this.state.selectedNodeJsVersions[v] ?? false}
                    label={v}
                    onChange={checked =>
                      this.setState(state => ({
                        ...state,
                        selectedNodeJsVersions: {
                          ...this.state.selectedNodeJsVersions,
                          [v]: checked,
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
          nodeJsVersions={Object.entries(this.state.selectedNodeJsVersions)
            .filter(([k, v]) => v)
            .map(([k, v]) => k)}
          values={this.state.values}
        />
      </div>
    );
  }
}

render(<App />, document.body);
