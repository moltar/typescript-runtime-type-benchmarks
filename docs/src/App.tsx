import { Component, type ComponentChildren } from 'preact';
import * as vega from 'vega';
import * as vegaLite from 'vega-lite';
import { CHART } from './theme.js';

// which results are attempted to load
// the first is selected automatically
const NODE_VERSIONS = [24, 23, 22, 21, 20];

const BUN_VERSIONS = [1.2];

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

// colors come from the active theme, keyed by benchmark name
const BENCHMARKS = [
  { name: 'parseSafe', label: 'Safe Parsing', order: '0' },
  { name: 'parseStrict', label: 'Strict Parsing', order: '1' },
  { name: 'assertLoose', label: 'Loose Assertion', order: '2' },
  { name: 'assertStrict', label: 'Strict Assertion', order: '3' },
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

/**
 * Parses an HTTP `Last-Modified` header into a Date. On GitHub Pages this
 * reflects when the site was last published, i.e. when the benchmark data was
 * last updated. Returns undefined when the header is missing or unparseable.
 */
function parseLastModified(header: string | null): Date | undefined {
  if (!header) {
    return undefined;
  }

  const date = new Date(header);

  return Number.isNaN(date.getTime()) ? undefined : date;
}

/**
 * Returns the more recent of two optional dates.
 */
function mostRecent(a: Date | undefined, b: Date | undefined): Date | undefined {
  if (!a) {
    return b;
  }

  if (!b) {
    return a;
  }

  return a > b ? a : b;
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
  dark,
}: {
  selectedBenchmarks: typeof BENCHMARKS;
  selectedNodeJsVersions: string[];
  selectedBunVersions: string[];
  selectedDenoVersions: string[];
  benchmarkResultsNodejs: BenchmarkResult[];
  benchmarkResultsBun: BenchmarkResult[];
  benchmarkResultsDeno: BenchmarkResult[];
  sort?: 'alphabetically' | 'fastest' | 'popularity';
  dark: boolean;
}) {
  if (
    !selectedBenchmarks.length ||
    (!selectedNodeJsVersions.length &&
      !selectedBunVersions.length &&
      !selectedDenoVersions.length)
  ) {
    return '';
  }

  const chart = CHART[dark ? 'dark' : 'light'];

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
      opsLabel: b.ops ? b.ops.toLocaleString('en-US') : 'n/a',
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
      opsLabel: b.ops ? b.ops.toLocaleString('en-US') : 'n/a',
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
      opsLabel: b.ops ? b.ops.toLocaleString('en-US') : 'n/a',
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
      colorScaleRange.push(chart.series[b.name]);
    }
  });

  selectedBenchmarks.forEach(b => {
    for (let i = 0; i < bunVersionCount; i++) {
      colorScaleRange.push(chart.series[b.name]);
    }
  });

  selectedBenchmarks.forEach(b => {
    for (let i = 0; i < denoVersionCount; i++) {
      colorScaleRange.push(chart.series[b.name]);
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
      step: 16 / (nodeJsVersionCount + bunVersionCount + denoVersionCount),
    },
    spacing: 10,
    background: 'transparent', // no white graphs for dark mode users
    config: {
      view: { stroke: null },
      font: chart.font,
      header: {
        labelFont: chart.font,
        labelColor: chart.headerColor,
        labelFontWeight: 600,
      },
      axis: {
        labelFont: chart.monoFont,
        labelColor: chart.axisColor,
        titleFont: chart.font,
        titleColor: chart.axisColor,
        gridColor: chart.gridColor,
        tickColor: chart.domainColor,
        domainColor: chart.domainColor,
      },
    },
    facet: {
      row: {
        field: 'name',
        title: null,
        header: {
          labelAngle: 0,
          labelOrient: 'left',
          labelAnchor: 'middle',
          labelAlign: 'left',
          labelFontSize: 12.5,
          labelLimit: 260,
        },
        sort: sortedNames,
      },
    },
    spec: {
      layer: [
        {
          // full-width track so benchmarks a library doesn't run still
          // read as deliberate empty rows
          mark: {
            type: 'bar',
            cornerRadius: 2,
          },
          width: chart.width,
          encoding: {
            x: { value: 0 },
            x2: { value: chart.width },
            color: { value: chart.trackColor },
          },
        },
        {
          mark: {
            type: 'bar',
            cornerRadiusEnd: 2,
          },
        },
        {
          mark: {
            type: 'text',
            align: 'left',
            baseline: 'middle',
            dx: 4,
            font: chart.monoFont,
            fontSize: 9.5,
            fill: chart.valueColor,
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
            format: '~s',
            tickCount: 6,
            grid: false,
            labelFontSize: 11,
            titleFontSize: 12.5,
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
    dark: boolean;
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
        dark: this.props.dark,
      }),
    });
  }

  render() {
    this.createGraph().catch(error => {
      console.log('Create graph error', error);
    });

    if (!this.state.svg) {
      return <div class="empty">No Benchmark Selected</div>;
    }

    return <div dangerouslySetInnerHTML={{ __html: this.state.svg }} />;
  }
}

function Chip(props: {
  id: string;
  label: string;
  color?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label
      class={`chip${props.checked ? ' checked' : ''}`}
      style={props.color ? { '--dot': props.color } : undefined}
    >
      <input
        id={props.id}
        type="checkbox"
        name={props.id}
        checked={props.checked}
        onInput={() => props.onChange(!props.checked)}
      />
      {props.color && <span class="dot" />}
      {props.label}
    </label>
  );
}

function StarIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z" />
    </svg>
  );
}

function ForkIcon() {
  return (
    <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden="true">
      <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z" />
    </svg>
  );
}

function BenchmarkDescription(props: {
  name: string;
  benchmark: string;
  children?: ComponentChildren;
}) {
  return (
    <div class="bench-doc">
      <h4>
        <span
          class="swatch"
          style={{ background: `var(--c-${props.benchmark})` }}
        />
        {props.name}
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
    lastUpdated?: Date;
    darkMode: boolean;
  }
> {
  darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');

  constructor() {
    super();
    this.state = {
      darkMode: this.darkModeQuery.matches,
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
    };
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
    this.darkModeQuery.addEventListener('change', event => {
      this.setState({ darkMode: event.matches });
    });

    loadPackagesPopularity().catch(err => {
      console.error(`error while loading package popularity`, err);
    });

    NODE_VERSIONS.forEach((v, i) => {
      fetch(`results/node-${v}.json`)
        .then(response => {
          const lastUpdated = parseLastModified(
            response.headers.get('last-modified')
          );

          return response
            .json()
            .then((data: BenchmarkResponse) => ({ data, lastUpdated }));
        })
        .then(({ data, lastUpdated }) => {
          this.setState(state => ({
            ...state,

            // reflects when the site was last published, shown to the user
            lastUpdated: mostRecent(state.lastUpdated, lastUpdated),

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
      <div class="app">
        <header class="masthead">
          <div>
            <h1>Runtype Benchmarks</h1>
            <div class="strip" aria-hidden="true">
              {BENCHMARKS.map(b => (
                <span style={{ background: `var(--c-${b.name})` }} />
              ))}
            </div>
            <p class="tagline">
              Benchmark comparison of packages with runtime validation and
              TypeScript support.
            </p>
            {this.state.lastUpdated && (
              <p class="updated">
                Data last updated:{' '}
                {this.state.lastUpdated.toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            )}
          </div>
          <div class="gh-links">
            <a
              class="gh-btn"
              href="https://github.com/moltar/typescript-runtime-type-benchmarks"
              aria-label="Star moltar/typescript-runtime-type-benchmarks on GitHub"
            >
              <StarIcon /> Star
            </a>
            <a
              class="gh-btn"
              href="https://github.com/moltar/typescript-runtime-type-benchmarks/fork"
              aria-label="Fork moltar/typescript-runtime-type-benchmarks on GitHub"
            >
              <ForkIcon /> Fork
            </a>
          </div>
        </header>

        <section class="controls">
          <fieldset class="control-group">
            <legend>Benchmarks</legend>
            <div class="chip-row">
              {BENCHMARKS.map(b => {
                return (
                  <Chip
                    id={b.name}
                    color={`var(--c-${b.name})`}
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
          </fieldset>

          <fieldset class="control-group">
            <legend>Node.js</legend>
            <div class="chip-row">
              {this.getNodeJsVersions().map(v => {
                return (
                  <Chip
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
          </fieldset>

          <fieldset class="control-group">
            <legend>Bun</legend>
            <div class="chip-row">
              {this.getBunVersions().map(v => {
                return (
                  <Chip
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
          </fieldset>

          <fieldset class="control-group">
            <legend>Deno</legend>
            <div class="chip-row">
              {this.getDenoVersions().map(v => {
                return (
                  <Chip
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
          </fieldset>

          <div class="control-group">
            <span class="group-label" id="sort-label">
              Sort
            </span>
            <select
              class="sort-select"
              aria-labelledby="sort-label"
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
          </div>
        </section>

        <main class="chart">
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
            dark={this.state.darkMode}
          />
        </main>

        <section class="bench-docs">
          <BenchmarkDescription name="Safe Parsing" benchmark="parseSafe">
            <p>
              Check the input object against a schema and return it. Raise an
              error if the input object does not conform to the schema, e.g. an
              attribute is a number instead of a string or an attribute is
              missing completely. Any extra keys in the input object that are
              not defined in the schema must be removed.
            </p>
          </BenchmarkDescription>

          <BenchmarkDescription name="Strict Parsing" benchmark="parseStrict">
            <p>
              Like safe parsing but raise an error if input objects contain
              extra keys.
            </p>
          </BenchmarkDescription>

          <BenchmarkDescription name="Loose Assertion" benchmark="assertLoose">
            <p>
              Check the input object against a schema and raise an exception if
              it does not match. No errors are raised when encountering extra
              keys.
            </p>
          </BenchmarkDescription>

          <BenchmarkDescription
            name="Strict Assertion"
            benchmark="assertStrict"
          >
            <p>
              Like loose assertion but raise an error if input objects or nested
              input objects contain extra keys.
            </p>
          </BenchmarkDescription>
        </section>
      </div>
    );
  }
}
