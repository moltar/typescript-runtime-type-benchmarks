// Chart styling, one config per color scheme. Page styling lives in
// styles.css; these values only reach the vega spec.

export interface ChartTheme {
  /** color per benchmark name, stable across the whole page */
  series: { [benchmark: string]: string };
  /** font stack for axis labels and facet headers */
  font: string;
  /** monospaced stack for numbers */
  monoFont: string;
  /** facet header (library name) color */
  headerColor: string;
  /** axis label color */
  axisColor: string;
  /** bar value label color */
  valueColor: string;
  /** grid line color */
  gridColor: string;
  /** axis domain/tick color */
  domainColor: string;
  /** bar plot width in px */
  width: number;
}

const INTER = "'Inter', system-ui, sans-serif";
const JET_MONO = "'JetBrains Mono', ui-monospace, monospace";

// categorical palettes validated for CVD separation + contrast
// (order: parseSafe, parseStrict, assertLoose, assertStrict)
export const CHART: { light: ChartTheme; dark: ChartTheme } = {
  light: {
    series: {
      parseSafe: '#2a78d6',
      parseStrict: '#eb6834',
      assertLoose: '#1baf7a',
      assertStrict: '#eda100',
    },
    font: INTER,
    monoFont: JET_MONO,
    headerColor: '#111827',
    axisColor: '#9ca3af',
    valueColor: '#6b7280',
    gridColor: '#f3f4f6',
    domainColor: '#e5e7eb',
    width: 470,
  },
  dark: {
    series: {
      parseSafe: '#3987e5',
      parseStrict: '#d95926',
      assertLoose: '#199e70',
      assertStrict: '#c98500',
    },
    font: INTER,
    monoFont: JET_MONO,
    headerColor: '#e5e7eb',
    axisColor: '#6b7280',
    valueColor: '#9ca3af',
    gridColor: '#1f242c',
    domainColor: '#333a44',
    width: 470,
  },
};
