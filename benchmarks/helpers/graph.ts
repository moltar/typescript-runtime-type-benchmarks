// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { optimize } from 'svgo';
import { parse, View } from 'vega';
import { compile } from 'vega-lite';

export async function graph(filename: string): Promise<string> {
  const vegaSpec = compile({
    data: {
      url: filename,
    },
    mark: 'bar',
    width: 880,
    height: 600,
    encoding: {
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
        field: 'name',
        type: 'nominal',
        title: 'module',
        axis: {
          labelFontSize: 14,
          labelAngle: 90,
          titleFontSize: 14,
          titleFontWeight: 'normal',
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
