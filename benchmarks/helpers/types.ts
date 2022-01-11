export interface BenchmarkCase {
  readonly moduleName: string;

  // execute the actual benchmark function
  run(): void;

  // run the benchmarks jest test
  test(): void;
}

export abstract class Benchmark<Fn> implements BenchmarkCase {
  // name of the module that is benchmarked
  readonly moduleName: string;

  // the function that implements the benchmark
  readonly fn: Fn;

  constructor(moduleName: string, fn: Fn) {
    this.moduleName = moduleName;
    this.fn = fn;
  }

  // execute the actual benchmark function
  abstract run(): void;

  // run the benchmarks jest test
  abstract test(): void;
}

// Aliased any.
// Need to use ´any` for libraries that do not accept `unknown` as data input
// to their parse/assert functions.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type UnknownData = any;
