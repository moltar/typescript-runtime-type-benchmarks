import { Component, type ComponentChildren } from 'preact';
import * as vega from 'vega';
import * as vegaLite from 'vega-lite';

// which results are attempted to load
// the first is selected automatically
const NODE_VERSIONS = [23, 22, 21, 20, 19, 18, 16];

const BUN_VERSIONS = [1.2, 1.1];

const DENO_VERSIONS = [2];

interface BenchmarkResponse {
  results: BenchmarkResult[];
}

interface BenchmarkResult {
  name: string;
  benchmark: string;
  runtimeVersion: string;
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

const PACKAGES_POPULARITY: { [k: string]: number } = {};

type PackagePopularity = {
  name: string;
  weeklyDownloads: number;
};

async function loadPackagesPopularity() {
  await fetch('packagesPopularity.json')
    .then(res => res.json() as Promise<PackagePopularity[]>)
    .then(data => {
      data.forEach(p => {
        PACKAGES_POPULARITY[p.name] = p.weeklyDownloads;
      });
    });
}

function normalizePartialValues(values: BenchmarkResult[]): BenchmarkResult[] {
  if (!values.length) {
    return [];
  }

  const runtimeVersion = values[0].runtimeVersion;

  if (!values.every(v => v.runtimeVersion === runtimeVersion)) {
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
        runtimeVersion,
        ops: 0,
      });
    });
  });

  return normalized;
}

const nodeVersionRegex = /v([0-9]+)\./;
const bunVersionRegex = /^(\d+)\.(\d+)\./;
const denoVersionRegex = /([0-9]+)\./;

function getNodeMajorVersionNumber(nodeVersion: string): number {
  const match = nodeVersion.match(nodeVersionRegex);

  if (!match) {
    throw new Error(`Invalid node version: ${nodeVersion}`);
  }

  return parseInt(match[1]);
}

function getBunMajorAndMinorVersionNumber(bunVersion: string): number {
  const match = bunVersion.match(bunVersionRegex);

  if (!match) {
    throw new Error(`Invalid bun version: ${bunVersion}`);
  }

  // We can use just parseFloat but don't matter
  return parseFloat(`${match[1]}.${match[2]}`);
}

function getDenoMajorVersionNumber(denoVersion: string): number {
  const match = denoVersion.match(denoVersionRegex);

  if (!match) {
    throw new Error(`Invalid deno version: ${denoVersion}`);
  }

  return parseInt(match[1]);
}

async function graph({
  selectedBenchmarks,
  selectedNodeJsVersions,
  selectedBunVersions,
  selectedDenoVersions,
  benchmarkResultsNodejs,
  benchmarkResultsBun,
  benchmarkResultsDeno,
  sort,
}: {
  selectedBenchmarks: typeof BENCHMARKS;
  selectedNodeJsVersions: string[];
  selectedBunVersions: string[];
  selectedDenoVersions: string[];
  benchmarkResultsNodejs: BenchmarkResult[];
  benchmarkResultsBun: BenchmarkResult[];
  benchmarkResultsDeno: BenchmarkResult[];
  sort?: 'alphabetically' | 'fastest' | 'popularity';
}) {
  if (
    !selectedBenchmarks.length ||
    (!selectedNodeJsVersions.length &&
      !selectedBunVersions.length &&
      !selectedDenoVersions.length)
  ) {
    return '';
  }

  const selectedBenchmarkSet = new Set(selectedBenchmarks.map(b => b.name));

  const selectedNodeJsVersionsSet = new Set(selectedNodeJsVersions);
  const selectedBunVersionsSet = new Set(selectedBunVersions);
  const selectedDenoVersionsSet = new Set(selectedDenoVersions);

  const runtimesOrder = {
    NODE: 0,
    BUN: 1,
    DENO: 2,
  };

  const valuesNodejs = benchmarkResultsNodejs
    .filter(
      b =>
        selectedBenchmarkSet.has(b.benchmark) &&
        selectedNodeJsVersionsSet.has(b.runtimeVersion)
    )
    .map(b => ({
      ...b,
      opsLabel: b.ops.toLocaleString('en-US'),
      // artificical benchmark name to make sure its always sorted by
      // benchmark and node-version
      benchmark: [
        runtimesOrder.NODE,
        BENCHMARKS_ORDER[b.benchmark],
        NODE_VERSIONS.indexOf(getNodeMajorVersionNumber(b.runtimeVersion)),
        b.runtimeVersion,
        b.benchmark,
      ].join('-'),
    }));

  const valuesBun = benchmarkResultsBun
    .filter(
      b =>
        selectedBenchmarkSet.has(b.benchmark) &&
        selectedBunVersionsSet.has(b.runtimeVersion)
    )
    .map(b => ({
      ...b,
      opsLabel: b.ops.toLocaleString('en-US'),
      // artificical benchmark name to make sure its always sorted by
      // benchmark and bun-version
      benchmark: [
        runtimesOrder.BUN,
        BENCHMARKS_ORDER[b.benchmark],
        BUN_VERSIONS.indexOf(
          getBunMajorAndMinorVersionNumber(b.runtimeVersion)
        ),
        b.runtimeVersion,
        b.benchmark,
      ].join('-'),
    }));

  const valuesDeno = benchmarkResultsDeno
    .filter(
      b =>
        selectedBenchmarkSet.has(b.benchmark) &&
        selectedDenoVersionsSet.has(b.runtimeVersion)
    )
    .map(b => ({
      ...b,
      opsLabel: b.ops.toLocaleString('en-US'),
      // artificical benchmark name to make sure its always sorted by
      // benchmark and deno-version
      benchmark: [
        runtimesOrder.DENO,
        BENCHMARKS_ORDER[b.benchmark],
        DENO_VERSIONS.indexOf(getDenoMajorVersionNumber(b.runtimeVersion)),
        b.runtimeVersion,
        b.benchmark,
      ].join('-'),
    }));

  const nodeJsVersionCount = new Set(valuesNodejs.map(v => v.runtimeVersion))
    .size;
  const bunVersionCount = new Set(valuesBun.map(v => v.runtimeVersion)).size;
  const denoVersionCount = new Set(valuesDeno.map(v => v.runtimeVersion)).size;

  // build a color map so that each benchmark has the same color in different
  // node-versions
  const colorScaleRange: string[] = [];

  selectedBenchmarks.forEach(b => {
    for (let i = 0; i < nodeJsVersionCount; i++) {
      colorScaleRange.push(b.color);
    }
  });

  selectedBenchmarks.forEach(b => {
    for (let i = 0; i < bunVersionCount; i++) {
      colorScaleRange.push(b.color);
    }
  });

  selectedBenchmarks.forEach(b => {
    for (let i = 0; i < denoVersionCount; i++) {
      colorScaleRange.push(b.color);
    }
  });

  // build a list of module names for sorting
  let sortedValues: BenchmarkResult[] = [];

  if (sort === 'fastest' || !sort) {
    sortedValues = [...valuesNodejs, ...valuesBun, ...valuesDeno].sort(
      (a, b) => b.ops - a.ops
    );
  } else if (sort === 'alphabetically') {
    sortedValues = [...valuesNodejs, ...valuesBun, ...valuesDeno].sort(
      (a, b) => (a.name < b.name ? -1 : 1)
    );
  } else if (sort === 'popularity') {
    sortedValues = [...valuesNodejs, ...valuesBun, ...valuesDeno].sort(
      (a, b) => {
        const aPopularity = PACKAGES_POPULARITY[a.name] || 0;
        const bPopularity = PACKAGES_POPULARITY[b.name] || 0;

        return bPopularity - aPopularity;
      }
    );
  }

  // remove duplicates not sure whether vega-lite can handle that
  const sortedNames: string[] = [];

  new Set(sortedValues.map(b => b.name)).forEach(n => sortedNames.push(n));

  const vegaSpec = vegaLite.compile({
    data: {
      values: [...valuesNodejs, ...valuesBun, ...valuesDeno],
    },
    height: {
      step: 15 / (nodeJsVersionCount + bunVersionCount + denoVersionCount),
    },
    background: 'transparent', // no white graphs for dark mode users
    facet: {
      row: {
        field: 'name',
        title: null,
        header: {
          labelAngle: 0,
          labelOrient: 'left',
          labelAnchor: 'middle',
          labelAlign: 'left',
          labelFontSize: 12,
        },
        sort: sortedNames,
      },
    },
    spec: {
      layer: [
        {
          mark: 'bar',
          width: 600,
        },
        {
          mark: {
            type: 'text',
            align: 'left',
            baseline: 'middle',
            dx: 3,
          },
          encoding: {
            text: { field: 'opsLabel' },
          },
        },
      ],
      encoding: {
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
    bunVersions: string[];
    denoVersions: string[];
    valuesNodeJs: BenchmarkResult[];
    valuesBun: BenchmarkResult[];
    valuesDeno: BenchmarkResult[];
    sort: Parameters<typeof graph>[0]['sort'];
  },
  { svg?: string }
> {
  prevProps!: typeof this.props;

  async createGraph() {
    if (this.prevProps === this.props) {
      return;
    }

    this.prevProps = this.props;
    this.setState({
      svg: await graph({
        selectedBenchmarks: this.props.benchmarks,
        selectedNodeJsVersions: this.props.nodeJsVersions,
        selectedBunVersions: this.props.bunVersions,
        selectedDenoVersions: this.props.denoVersions,
        benchmarkResultsNodejs: this.props.valuesNodeJs,
        benchmarkResultsBun: this.props.valuesBun,
        benchmarkResultsDeno: this.props.valuesDeno,
        sort: this.props.sort,
      }),
    });
  }

  render() {
    this.createGraph().catch(error => {
      console.log('Create graph error', error);
    });

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
  color: string | undefined;
  children?: ComponentChildren;
}) {
  return (
    <div style={{ marginBotton: '1rem' }}>
      <h4>
        <span
          style={{
            backgroundColor: props.color ?? 'pink',
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

export class App extends Component<
  unknown,
  {
    selectedBenchmarks: { [key: string]: boolean };
    selectedNodeJsVersions: { [key: string]: boolean };
    selectedBunVersions: { [key: string]: boolean };
    selectedDenoVersions: { [key: string]: boolean };
    valuesNodeJs: BenchmarkResult[];
    valuesBun: BenchmarkResult[];
    valuesDeno: BenchmarkResult[];
    sortBy: 'fastest' | 'alphabetically' | 'popularity';
  }
> {
  constructor() {
    super();
    this.setState({
      selectedBenchmarks: BENCHMARKS.reduce(
        (acc, b) => ({ ...acc, [b.name]: true }),
        {}
      ),
      selectedNodeJsVersions: {},
      selectedBunVersions: {},
      selectedDenoVersions: {},
      valuesNodeJs: [],
      valuesBun: [],
      valuesDeno: [],
      sortBy: 'fastest' as const,
    });
  }

  getNodeJsVersions() {
    const versionsSet = new Set(
      this.state.valuesNodeJs
        .map(v => v.runtimeVersion)
        .filter(v => v !== undefined)
        .sort((a, b) => (a < b ? 1 : -1))
    );
    const res: string[] = [];

    versionsSet.forEach(v => res.push(v));

    return res;
  }

  getBunVersions() {
    const versionsSet = new Set(
      this.state.valuesBun
        .map(v => v.runtimeVersion)
        .filter(v => v !== undefined)
        .sort((a, b) => (a < b ? 1 : -1))
    );
    const res: string[] = [];

    versionsSet.forEach(v => res.push(v));

    return res;
  }

  getDenoVersions() {
    const versionsSet = new Set(
      this.state.valuesDeno
        .map(v => v.runtimeVersion)
        .filter(v => v !== undefined)
        .sort((a, b) => (a < b ? 1 : -1))
    );
    const res: string[] = [];

    versionsSet.forEach(v => res.push(v));

    return res;
  }

  async componentDidMount() {
    loadPackagesPopularity().catch(err => {
      console.error(`error while loading package popularity`, err);
    });

    NODE_VERSIONS.forEach((v, i) => {
      fetch(`results/node-${v}.json`)
        .then(response => response.json() as Promise<BenchmarkResponse>)
        .then(data => {
          this.setState(state => ({
            ...state,

            // select the first node versions benchmark automatically
            selectedNodeJsVersions:
              i === 0
                ? {
                    ...state.selectedNodeJsVersions,
                    [data.results[0].runtimeVersion]: true,
                  }
                : state.selectedNodeJsVersions,

            valuesNodeJs: [
              ...state.valuesNodeJs,
              ...normalizePartialValues(data.results),
            ],
          }));
        })
        .catch(err => {
          console.info(`no data for node ${v}`, err);
        });
    });

    BUN_VERSIONS.forEach(v => {
      fetch(`results/bun-${v}.json`)
        .then(response => response.json() as Promise<BenchmarkResponse>)
        .then(data => {
          this.setState(state => ({
            ...state,

            // select the first node versions benchmark automatically
            selectedBunVersions: state.selectedBunVersions,

            valuesBun: [
              ...state.valuesBun,
              ...normalizePartialValues(data.results),
            ],
          }));
        })
        .catch(err => {
          console.info(`no data for bun ${v}`, err);
        });
    });

    DENO_VERSIONS.forEach(v => {
      fetch(`results/deno-${v}.json`)
        .then(response => response.json() as Promise<BenchmarkResponse>)
        .then(data => {
          this.setState(state => ({
            ...state,

            // select the first node versions benchmark automatically
            selectedDenoVersions: state.selectedDenoVersions,

            valuesDeno: [
              ...state.valuesDeno,
              ...normalizePartialValues(data.results),
            ],
          }));
        })
        .catch(err => {
          console.info(`no data for deno ${v}`, err);
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
          <div>
            <a
              class="github-button"
              href="https://github.com/moltar/typescript-runtime-type-benchmarks"
              data-color-scheme="no-preference: dark; light: dark_dimmed; dark: dark;"
              data-icon="octicon-star"
              data-size="large"
              data-show-count="true"
              aria-label="Star moltar/typescript-runtime-type-benchmarks on GitHub"
            >
              Star
            </a>
            <a
              class="github-button"
              href="https://github.com/moltar/typescript-runtime-type-benchmarks/fork"
              data-color-scheme="no-preference: dark; light: dark_dimmed; dark: dark;"
              data-icon="octicon-repo-forked"
              data-size="large"
              data-show-count="true"
              aria-label="Fork moltar/typescript-runtime-type-benchmarks on GitHub"
            >
              Fork
            </a>
          </div>
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
            <label>Bun Versions:</label>
            <div>
              {this.getBunVersions().map(v => {
                return (
                  <Checkbox
                    id={v}
                    checked={this.state.selectedBunVersions[v] ?? false}
                    label={v}
                    onChange={checked =>
                      this.setState(state => ({
                        ...state,
                        selectedBunVersions: {
                          ...this.state.selectedBunVersions,
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
            <label>Deno Versions:</label>
            <div>
              {this.getDenoVersions().map(v => {
                return (
                  <Checkbox
                    id={v}
                    checked={this.state.selectedDenoVersions[v] ?? false}
                    label={v}
                    onChange={checked =>
                      this.setState(state => ({
                        ...state,
                        selectedDenoVersions: {
                          ...this.state.selectedDenoVersions,
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
                <option value="fastest">Fastest</option>
                <option value="alphabetically">Alphabetically</option>
                <option value="popularity">Popularity</option>
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
          bunVersions={Object.entries(this.state.selectedBunVersions)
            .sort()
            .filter(entry => entry[1])
            .map(entry => entry[0])}
          denoVersions={Object.entries(this.state.selectedDenoVersions)
            .sort()
            .filter(entry => entry[1])
            .map(entry => entry[0])}
          valuesNodeJs={this.state.valuesNodeJs}
          valuesBun={this.state.valuesBun}
          valuesDeno={this.state.valuesDeno}
          sort={this.state.sortBy}
        />

        <div>
          <BenchmarkDescription
            name="Safe Parsing"
            color={BENCHMARKS.find(x => x.name === 'parseSafe')?.color}
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
            color={BENCHMARKS.find(x => x.name === 'parseStrict')?.color}
          >
            <p>
              Like safe parsing but raise an error if input objects contain
              extra keys.
            </p>
          </BenchmarkDescription>

          <BenchmarkDescription
            name="Loose Assertion"
            color={BENCHMARKS.find(x => x.name === 'assertLoose')?.color}
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
            color={BENCHMARKS.find(x => x.name === 'assertStrict')?.color}
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
