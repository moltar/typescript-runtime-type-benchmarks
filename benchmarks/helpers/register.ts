import { AssertLoose } from '../assertLoose';
import { AssertStrict } from '../assertStrict';
import { ParseSafe } from '../parseSafe';
import { ParseStrict } from '../parseStrict';
import { BenchmarkCase } from './types';

/**
 * Map of all benchmarks.
 */
export const availableBenchmarks = {
  parseSafe: ParseSafe,
  parseStrict: ParseStrict,
  assertLoose: AssertLoose,
  assertStrict: AssertStrict,
};

type AvailableBenchmarks = typeof availableBenchmarks;
export type AvailableBenchmarksIds = keyof AvailableBenchmarks;

const registeredBenchmarks = new Map<AvailableBenchmarksIds, BenchmarkCase[]>();

/**
 * Return the list of all registered benchmarks.
 */
export function getRegisteredBenchmarks(): [
  keyof AvailableBenchmarks,
  BenchmarkCase[]
][] {
  return [...registeredBenchmarks.entries()];
}

/**
 * Add a specific benchmark implementation for a given library.
 */
export function addCase<
  K extends keyof AvailableBenchmarks,
  I = AvailableBenchmarks[K]['prototype']['fn']
>(
  moduleName: string,
  benchmarkId: K,
  implementation: I,
  options?: { disabled?: boolean }
) {
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

  if (options?.disabled) {
    return;
  }

  const benchmarkCtor = availableBenchmarks[benchmarkId];

  benchmarks.push(
    new benchmarkCtor(
      moduleName,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      implementation as any
    )
  );
}

export function createCase<
  K extends keyof AvailableBenchmarks,
  I = AvailableBenchmarks[K]['prototype']['fn']
>(
  moduleName: string,
  benchmarkId: K,
  builder: () => I,
  options?: { disabled?: boolean }
) {
  const impl = builder();

  if (!impl) {
    throw new Error(
      `case implementation function missing in benchmark "${benchmarkId}" for module "${moduleName}"`
    );
  }

  addCase(moduleName, benchmarkId, impl, options);
}
