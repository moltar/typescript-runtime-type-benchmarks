import { BenchmarkCase } from './types';
import { Validate } from '../validate';
import { ValidateStrict } from '../validateStrict';

export const availableBenchmarks = {
  validate: Validate,
  validateStrict: ValidateStrict,
};
type AvailableBenchmarks = typeof availableBenchmarks;
export type AvailableBenchmarksIds = keyof AvailableBenchmarks;

const registeredBenchmarks = new Map<AvailableBenchmarksIds, BenchmarkCase[]>();

export function getRegisteredBenchmarks(): [
  keyof AvailableBenchmarks,
  BenchmarkCase[]
][] {
  return [...registeredBenchmarks.entries()];
}

/**
 * Add a benchmark implementation.
 */
export function register<
  K extends keyof AvailableBenchmarks,
  I = AvailableBenchmarks[K]['prototype']['fn']
>(moduleName: string, benchmarkId: K, implementation: I) {
  let benchmarks = registeredBenchmarks.get(benchmarkId);

  if (!benchmarks) {
    benchmarks = [];

    registeredBenchmarks.set(benchmarkId, benchmarks);
  }

  if (benchmarks.find(c => c.moduleName === moduleName)) {
    console.error(
      'benchmark',
      benchmarkId,
      'is already defined for module',
      moduleName
    );
  }

  const benchmarkCtor = availableBenchmarks[benchmarkId];

  benchmarks.push(new benchmarkCtor(moduleName, implementation as any));
}
