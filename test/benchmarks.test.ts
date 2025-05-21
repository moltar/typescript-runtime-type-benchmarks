import { test, describe, expect } from 'vitest';
import { getRegisteredBenchmarks } from '../benchmarks';
import { cases } from '../cases';

// all cases need to be imported here because vitest cannot pick up dynamically
// imported `test` and `describe`
import '../cases/aeria';
import '../cases/ajv';
import '../cases/arktype';
import '../cases/banditypes';
import '../cases/bueno';
import '../cases/caketype';
import '../cases/class-validator';
import '../cases/cleaners';
import '../cases/computed-types';
import '../cases/decoders';
import '../cases/io-ts';
import '../cases/joi';
import '../cases/jointz';
import '../cases/json-decoder';
import '../cases/mol_data';
import '../cases/mojotech-json-type-validation';
import '../cases/mondrian-framework';
import '../cases/myzod';
import '../cases/ok-computer';
import '../cases/parse-dont-validate';
import '../cases/paseri';
import '../cases/pure-parse';
import '../cases/purify-ts';
import '../cases/r-assign';
import '../cases/rescript-schema';
import '../cases/rulr';
import '../cases/runtypes';
import '../cases/sapphire-shapeshift';
import '../cases/simple-runtypes';
import '../cases/sinclair-typebox-ahead-of-time';
import '../cases/sinclair-typebox-dynamic';
import '../cases/sinclair-typebox-just-in-time';
import '../cases/sinclair-typemap-valibot';
import '../cases/sinclair-typemap-zod';
import '../cases/spectypes';
import '../cases/stnl';
import '../cases/succulent';
import '../cases/superstruct';
import '../cases/suretype';
import '../cases/sury';
import '../cases/to-typed';
import '../cases/toi';
import '../cases/ts-interface-checker';
import '../cases/ts-json-validator';
import '../cases/ts-runtime-checks';
import '../cases/ts-utils';
import '../cases/tson';
import '../cases/typeofweb-schema';
import '../cases/typia';
import '../cases/unknownutil';
import '../cases/valibot';
import '../cases/valita';
import '../cases/vality';
import '../cases/yup';
import '../cases/zod';
import '../cases/zod4';
import '../cases/deepkit';
import '../cases/effect-schema';
import '../cases/ts-auto-guard';
import '../cases/type-predicate-generator';
import '../cases/tiny-schema-validator';
import '../cases/jet-validators';

test('all cases must have been imported in tests', () => {
  expect(
    new Set<string>(
      getRegisteredBenchmarks().flatMap(pair =>
        pair[1].map(b => b.moduleName.split(' ')[0]),
      ),
    ).size,
  ).toBe(cases.length);
});

getRegisteredBenchmarks().forEach(([benchmarkId, benchmarkCases]) => {
  describe(benchmarkId, () => {
    benchmarkCases.forEach(c => c.test(describe, expect, test));
  });
});
