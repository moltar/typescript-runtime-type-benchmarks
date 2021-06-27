import { Component, Fragment, h, render } from 'preact';
import * as vegaLite from 'vega-lite';
import * as vega from 'vega';

const NODE_VERSIONS = [10, 12, 13, 14];

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
const BENCHMARKS = ['validate', 'validateStrict'].map((name, i) => ({
  name,
  color: COLORS[i],
}));

async function graph(
  selectedBenchmarks: typeof BENCHMARKS,
  values: BenchmarkResult[]
) {
  const selectedBenchmarkIndex = new Map(
    selectedBenchmarks.map(b => [b.name, b])
  );

  const vegaSpec = vegaLite.compile({
    data: {
      values: values.filter(b => selectedBenchmarkIndex.has(b.benchmark)),
    },
    height: 400,
    mark: 'bar',
    encoding: {
      column: {
        field: 'name',
        type: 'nominal',
        title: null,
        spacing: 10,
        header: {
          labelAngle: -90,
          labelAlign: 'right',
          labelAnchor: 'middle',
          labelOrient: 'top',
          labelFontSize: 12,
        },
      },
      y: {
        field: 'ops',
        type: 'quantitative',
        title: 'operations / sec',
        axis: {
          labelFontSize: 12,
          titleFontSize: 14,
          titleFontWeight: 'normal',
        },
      },
      x: {
        field: 'benchmark',
        type: 'nominal',
        title: null,
        axis: {
          labelFontSize: 14,
          labelAngle: 90,
        },
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
        .then(data =>
          this.setState(state => ({
            ...state,
            values: [...state.values, ...data.results],
          }))
        )
        .catch(err => {
          console.info(`no data for node ${v}`);
        });
    });
  }

  render() {
    return (
      <div>
        <h1 style={{ marginBottom: '3rem' }}>
          Benchmark Comparison of Packages with Runtime Validation and
          TypeScript Support
        </h1>

        <Graph
          benchmarks={BENCHMARKS.filter(
            b => this.state.selectedBenchmarks[b.name]
          )}
          values={this.state.values}
        />

        <div style={{ display: 'flex', margin: '1rem' }}>
          <div style={{ width: '33%' }}>
            {BENCHMARKS.map(b => {
              return (
                <Checkbox
                  id={b.name}
                  color={b.color}
                  checked={this.state.selectedBenchmarks[b.name] ?? false}
                  label={b.name}
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
    );
  }
}

render(<App />, document.body);
