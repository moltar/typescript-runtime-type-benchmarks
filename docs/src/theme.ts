// Visual themes. The active theme is picked via the `?theme=` query
// parameter (mockup switch); `report` is the default. Each theme has a
// light and a dark chart config, chosen by prefers-color-scheme.

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

export interface Theme {
  name: string;
  chart: { light: ChartTheme; dark: ChartTheme };
}

const PLEX_SANS = "'IBM Plex Sans', system-ui, sans-serif";
const PLEX_MONO = "'IBM Plex Mono', ui-monospace, monospace";
const GROTESK = "'Space Grotesk', system-ui, sans-serif";
const JET_MONO = "'JetBrains Mono', ui-monospace, monospace";
const INTER = "'Inter', system-ui, sans-serif";

// categorical palettes validated for CVD separation + contrast
// (order: parseSafe, parseStrict, assertLoose, assertStrict)
const SERIES_LIGHT = {
  parseSafe: '#2a78d6',
  parseStrict: '#eb6834',
  assertLoose: '#1baf7a',
  assertStrict: '#eda100',
};

const SERIES_DARK = {
  parseSafe: '#3987e5',
  parseStrict: '#d95926',
  assertLoose: '#199e70',
  assertStrict: '#c98500',
};

export const THEMES: { [name: string]: Theme } = {
  report: {
    name: 'report',
    chart: {
      light: {
        series: SERIES_LIGHT,
        font: PLEX_SANS,
        monoFont: PLEX_MONO,
        headerColor: '#1a1a19',
        axisColor: '#898781',
        valueColor: '#52514e',
        gridColor: '#efedea',
        domainColor: '#d8d5d0',
        width: 600,
      },
      dark: {
        series: SERIES_DARK,
        font: PLEX_SANS,
        monoFont: PLEX_MONO,
        headerColor: '#e8e6df',
        axisColor: '#898781',
        valueColor: '#a3a19a',
        gridColor: '#262521',
        domainColor: '#3a3934',
        width: 600,
      },
    },
  },
  panel: {
    name: 'panel',
    chart: {
      light: {
        series: SERIES_LIGHT,
        font: GROTESK,
        monoFont: JET_MONO,
        headerColor: '#1b1b20',
        axisColor: '#8b8b93',
        valueColor: '#62626b',
        gridColor: '#ececef',
        domainColor: '#d5d5da',
        width: 600,
      },
      dark: {
        series: SERIES_DARK,
        font: GROTESK,
        monoFont: JET_MONO,
        headerColor: '#e8e6df',
        axisColor: '#8b898f',
        valueColor: '#a8a6ad',
        gridColor: '#26262e',
        domainColor: '#3a3a44',
        width: 600,
      },
    },
  },
  tool: {
    name: 'tool',
    chart: {
      light: {
        series: SERIES_LIGHT,
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
        series: SERIES_DARK,
        font: INTER,
        monoFont: JET_MONO,
        headerColor: '#e5e7eb',
        axisColor: '#6b7280',
        valueColor: '#9ca3af',
        gridColor: '#1f242c',
        domainColor: '#333a44',
        width: 470,
      },
    },
  },
};

export function activeTheme(): Theme {
  const name = new URLSearchParams(window.location.search).get('theme');

  return (name && THEMES[name]) || THEMES.report;
}
