import { getRegisteredBenchmarks } from '../benchmarks';
import { cases } from '../cases';

// all cases need to be imported here because jest cannot pic up dynamically
// imported `test` and `describe`
import '../cases/ajv';
import '../cases/bueno';
import '../cases/class-validator';
import '../cases/computed-types';
import '../cases/decoders';
import '../cases/io-ts';
import '../cases/jointz';
import '../cases/json-decoder';
import '../cases/marshal';
import '../cases/mojotech-json-type-validation';
import '../cases/myzod';
import '../cases/ok-computer';
import '../cases/parse-dont-validate';
import '../cases/purify-ts';
import '../cases/r-assign';
import '../cases/rescript-struct';
import '../cases/rulr';
import '../cases/runtypes';
import '../cases/sapphire-shapeshift';
import '../cases/simple-runtypes';
import '../cases/sinclair-typebox';
import '../cases/spectypes';
import '../cases/superstruct';
import '../cases/suretype';
import '../cases/to-typed';
import '../cases/toi';
import '../cases/ts-interface-checker';
import '../cases/ts-json-validator';
import '../cases/ts-runtime-checks';
import '../cases/ts-utils';
import '../cases/tson';
import '../cases/typeofweb-schema';
import '../cases/valita';
import '../cases/vality';
import '../cases/yup';
import '../cases/zod';

test('all cases must have been imported in tests', () => {
  expect(
    new Set<string>(
      getRegisteredBenchmarks().flatMap(pair =>
        pair[1].map(b => b.moduleName.split(' ')[0])
      )
    ).size
  ).toBe(cases.length);
});

getRegisteredBenchmarks().forEach(([benchmarkId, benchmarkCases]) => {
  describe(benchmarkId, () => {
    benchmarkCases.forEach(c => c.test());
  });
});
