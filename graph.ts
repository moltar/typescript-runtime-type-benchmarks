import { View, parse } from 'vega';
import { compile } from 'vega-lite';
import SVGO from 'svgo';

const svgo = new SVGO({
  js2svg: {
    pretty: true,
  },
});

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

  // Pending issue resolution:
  // https://github.com/vega/vega/issues/2640
  // https://github.com/svg/svgo/issues/1252
  // const optimizeSvg = await svgo.optimize(svg);
  // return optimizeSvg.data;

  return svg;
}
