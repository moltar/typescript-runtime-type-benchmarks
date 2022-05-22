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
import '../cases/purify-ts';
import '../cases/rulr';
import '../cases/runtypes';
import '../cases/simple-runtypes';
import '../cases/spectypes';
import '../cases/superstruct';
import '../cases/suretype';
import '../cases/toi';
import '../cases/ts-interface-checker';
import '../cases/ts-json-validator';
import '../cases/ts-utils';
import '../cases/tson';
import '../cases/typeofweb-schema';
import '../cases/valita';
import '../cases/yup';
import '../cases/zod';

test('all cases must have been imported in tests', () => {
  const registeredCases = new Set<string>();

  getRegisteredBenchmarks().forEach(nameBenchmarkPair => {
    nameBenchmarkPair[1].forEach(b => {
      registeredCases.add(b.moduleName);
    });
  });

  expect(registeredCases.size).toEqual(cases.length);
});

getRegisteredBenchmarks().forEach(([benchmarkId, benchmarkCases]) => {
  describe(benchmarkId, () => {
    benchmarkCases.forEach(c => c.test());
  });
});
