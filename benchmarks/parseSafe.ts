import { Benchmark } from './helpers/types';
import type { ExpectStatic, SuiteAPI, TestAPI } from 'vitest';

export const validateData = Object.freeze({
  number: 1,
  negNumber: -1,
  maxNumber: Number.MAX_VALUE,
  string: 'string',
  longString:
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum. Vivendum intellegat et qui, ei denique consequuntur vix. Semper aeterno percipit ut his, sea ex utinam referrentur repudiandae. No epicuri hendrerit consetetur sit, sit dicta adipiscing ex, in facete detracto deterruisset duo. Quot populo ad qui. Sit fugit nostrum et. Ad per diam dicant interesset, lorem iusto sensibus ut sed. No dicam aperiam vis. Pri posse graeco definitiones cu, id eam populo quaestio adipiscing, usu quod malorum te. Ex nam agam veri, dicunt efficiantur ad qui, ad legere adversarium sit. Commune platonem mel id, brute adipiscing duo an. Vivendum intellegat et qui, ei denique consequuntur vix. Offendit eleifend moderatius ex vix, quem odio mazim et qui, purto expetendis cotidieque quo cu, veri persius vituperata ei nec. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.',
  boolean: true,
  deeplyNested: {
    foo: 'bar',
    num: 1,
    bool: false,
  },
});

/**
 * The inputs the benchmarks measure: plain, mutable copies of `validateData`,
 * shaped like the output of `JSON.parse` (which is what validators see in
 * practice). Each `run()` takes the next one from a small pool.
 *
 * `validateData` itself stays frozen so the tests catch libraries that mutate
 * their input, but it must not be the benchmark input: engines special-case
 * a frozen object and a value they can treat as a compile-time constant, which
 * skews the numbers.
 *
 * - JavaScriptCore (Bun) takes a slow path for `Object.keys` and `for...in` on
 *   frozen objects (~50x slower than on a plain object), so on Bun every
 *   strict benchmark measured that slow path instead of the library.
 * - When every call receives the very same object, V8 and JavaScriptCore can
 *   constant-fold the property loads of a small, fully inlined validator and
 *   delete the checks altogether, crediting it with work it never did, while
 *   an equivalent validator split into helper functions is not folded.
 *   Rotating between equal copies keeps the input a runtime value; it costs
 *   every library the same single array read.
 */
const BENCHMARK_DATA_POOL_SIZE = 4; // power of two, see `nextBenchmarkData`

const benchmarkDataPool: (typeof validateData)[] = Array.from(
  { length: BENCHMARK_DATA_POOL_SIZE },
  () => JSON.parse(JSON.stringify(validateData)),
);

let benchmarkDataIndex = 0;

export function nextBenchmarkData(): typeof validateData {
  benchmarkDataIndex =
    (benchmarkDataIndex + 1) & (BENCHMARK_DATA_POOL_SIZE - 1);

  return benchmarkDataPool[benchmarkDataIndex];
}

type Fn = (data: unknown) => typeof validateData;

/**
 * Validate and ignore unknown keys, removing them from the result.
 *
 * When validating untrusted data, unknown keys should always be removed to
 * not result in unwanted parameters or the `__proto__` attribute being
 * maliciously passed to internal functions.
 */
export class ParseSafe extends Benchmark<Fn> {
  run() {
    this.sink = this.fn(nextBenchmarkData());
  }

  test(describe: SuiteAPI, expect: ExpectStatic, test: TestAPI) {
    describe(this.moduleName, () => {
      test('should validate the data', () => {
        expect(this.fn(validateData)).toEqual(validateData);
      });

      test('should validate with unknown attributes but remove them from the validated result', () => {
        const dataWithExtraKeys = {
          ...validateData,
          extraAttribute: 'foo',
        };

        expect(this.fn(dataWithExtraKeys)).toEqual(validateData);
      });

      // some libraries define the strict / non-strict validation as an
      // option to the record/object/type type so we need to test the
      // nested extra attribute explicitely so we know our runtype has
      // been constructed correctly
      test('should validate with unknown attributes but remove them from the validated result (nested)', () => {
        const dataWithExtraNestedKeys = {
          ...validateData,
          deeplyNested: {
            ...validateData.deeplyNested,
            extraNestedAttribute: 'bar',
          },
        };

        expect(this.fn(dataWithExtraNestedKeys)).toEqual(validateData);
      });

      test('should throw on missing attributes', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = {
          ...validateData,
        };

        delete data.number;

        expect(() => this.fn(data)).toThrow();
      });

      test('should throw on data with an invalid attribute', () => {
        expect(() =>
          this.fn({
            ...validateData,
            number: 'foo',
          }),
        ).toThrow();
      });
    });
  }
}
