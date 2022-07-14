// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Component, ComponentChildren, h, render } from 'preact';
import * as vega from 'vega';
import * as vegaLite from 'vega-lite';

// which results are attempted to load
// the first is selected automatically
const NODE_VERSIONS = [18, 16, 14];

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
  // '#ffffb3', not this one .. looks too bright to me
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
  { name: 'parseSafe', label: 'Safe Parsing', color: COLORS[0], order: '0' },
  {
    name: 'parseStrict',
    label: 'Strict Parsing',
    color: COLORS[1],
    order: '1',
  },
  {
    name: 'assertLoose',
    label: 'Loose Assertion',
    color: COLORS[2],
    order: '2',
  },
  {
    name: 'assertStrict',
    label: 'Strict Assertion',
    color: COLORS[3],
    order: '3',
  },
];

// order lookup table
const BENCHMARKS_ORDER: { [k: string]: string } = {};

BENCHMARKS.forEach(b => {
  BENCHMARKS_ORDER[b.name] = b.order;
});

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
      n => !results.find(r => r.benchmark === n)
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

async function graph({
  selectedBenchmarks,
  selectedNodeJsVersions,
  benchmarkResults,
  sort,
}: {
  selectedBenchmarks: typeof BENCHMARKS;
  selectedNodeJsVersions: string[];
  benchmarkResults: BenchmarkResult[];
  sort?: 'alphabetically' | 'fastest';
}) {
  if (!selectedBenchmarks.length || !selectedNodeJsVersions.length) {
    return '';
  }

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

  // build a list of module names for sorting
  let sortedValues: BenchmarkResult[];

  if (sort === 'fastest') {
    sortedValues = values.sort((a, b) => b.ops - a.ops);
  } else if (sort === 'alphabetically' || !sort) {
    sortedValues = values.sort((a, b) => (a.name < b.name ? -1 : 1));
  }

  // remove duplicates not sure whether vega-lite can handle that
  const sortedNames: string[] = [];

  new Set(sortedValues.map(b => b.name)).forEach(n => sortedNames.push(n));

  const vegaSpec = vegaLite.compile({
    data: {
      values,
    },
    width: 600,
    height: { step: 15 / nodeJsVersionCount },
    background: 'transparent', // no white graphs for dark mode users
    mark: 'bar',
    layer: [
      {
        mark: {
          type: 'text',
          align: 'left',
          baseline: 'middle',
          dx: 3,
        },
        encoding: {
          text: { field: 'ops', type: 'quantitative' },
        },
      },
    ],
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
          labelFontSize: 12,
        },
        sort: sortedNames,
      },
      x: {
        field: 'ops',
        type: 'quantitative',
        title: ['operations / sec', '(better ▶)'],
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
    sort: Parameters<typeof graph>[0]['sort'];
  },
  { svg?: string }
> {
  prevProps: typeof this.props;

  async createGraph() {
    if (this.prevProps === this.props) {
      return;
    }

    this.prevProps = this.props;
    this.setState({
      svg: await graph({
        selectedBenchmarks: this.props.benchmarks,
        selectedNodeJsVersions: this.props.nodeJsVersions,
        benchmarkResults: this.props.values,
        sort: this.props.sort,
      }),
    });
  }

  render() {
    this.createGraph();

    if (!this.state.svg) {
      return (
        <div style={{ margin: '5rem' }}>
          <i>No Benchmark Selected</i>
        </div>
      );
    }

    return (
      <div
        style={{ marginBottom: '1rem' }}
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
    <div
      style={{
        display: 'flex',
        backgroundColor: props.color,
        color: props.color ? 'black' : undefined,
      }}
    >
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

function BenchmarkDescription(props: {
  name: string;
  color: string;
  children?: ComponentChildren;
}) {
  return (
    <div style={{ marginBotton: '1rem' }}>
      <h4>
        <span
          style={{
            backgroundColor: props.color,
            display: 'inline-block',
            width: '2rem',
            marginRight: '0.5rem',
          }}
        >
          &nbsp;
        </span>
        {props.name}{' '}
      </h4>
      {props.children}
    </div>
  );
}

class App extends Component<
  {},
  {
    selectedBenchmarks: { [key: string]: boolean };
    selectedNodeJsVersions: { [key: string]: boolean };
    values: BenchmarkResult[];
    sortBy: 'fastest' | 'alphabetically';
  }
> {
  state = {
    selectedBenchmarks: BENCHMARKS.reduce(
      (acc, b) => ({ ...acc, [b.name]: true }),
      {}
    ),
    selectedNodeJsVersions: {},
    values: [],
    sortBy: 'alphabetically' as const,
  };

  getNodeJsVersions() {
    const versionsSet = new Set(
      this.state.values.map(v => v.nodeVersion).sort((a, b) => (a < b ? 1 : -1))
    );
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
          console.info(`no data for node ${v}`, err);
        });
    });
  }

  render() {
    return (
      <div>
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            justifyContent: 'space-between',
          }}
        >
          <h1>Runtype Benchmarks</h1>
          <a href="https://github.com/moltar/typescript-runtime-type-benchmarks/">
            Github Repository
          </a>
        </div>
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

          <div style={{ width: '12rem' }}>
            <label>
              Sort:
              <select
                onChange={
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (event: any) => {
                    this.setState({ sortBy: event.target.value });
                  }
                }
                value={this.state.sortBy}
              >
                <option value="alphabetically">Alphabetically</option>
                <option value="fastest">Fastest</option>
              </select>
            </label>
          </div>
        </div>

        <Graph
          benchmarks={BENCHMARKS.filter(
            b => this.state.selectedBenchmarks[b.name]
          )}
          nodeJsVersions={Object.entries(this.state.selectedNodeJsVersions)
            .sort()
            .filter(entry => entry[1])
            .map(entry => entry[0])}
          values={this.state.values}
          sort={this.state.sortBy}
        />

        <div>
          <BenchmarkDescription
            name="Safe Parsing"
            color={BENCHMARKS.find(x => x.name === 'parseSafe').color}
          >
            <p>
              Check the input object against a schema and return it.
              <br />
              Raise an error if the input object does not conform to the schema,
              e.g. an attribute is a number instead of a string or an attribute
              is missing completely.
              <br />
              Any extra keys in the input object that are not defined in the
              schema must be removed.
            </p>
          </BenchmarkDescription>

          <BenchmarkDescription
            name="Strict Parsing"
            color={BENCHMARKS.find(x => x.name === 'parseStrict').color}
          >
            <p>
              Like safe parsing but raise an error if input objects contain
              extra keys.
            </p>
          </BenchmarkDescription>

          <BenchmarkDescription
            name="Loose Assertion"
            color={BENCHMARKS.find(x => x.name === 'assertLoose').color}
          >
            <p>
              Check the input object against a schema and raise an exception if
              it does not match.
              <br />
              No errors are raised when encountering extra keys.
            </p>
          </BenchmarkDescription>

          <BenchmarkDescription
            name="Strict Assertion"
            color={BENCHMARKS.find(x => x.name === 'assertStrict').color}
          >
            <p>
              Like loose assertion but raise an error if input objects or nested
              input objects contain extra keys.
            </p>
          </BenchmarkDescription>
        </div>
      </div>
    );
  }
}

render(<App />, document.body);
