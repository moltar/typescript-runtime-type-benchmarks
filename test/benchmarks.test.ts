import { getRegisteredBenchmarks } from '../benchmarks';
import '../cases';

getRegisteredBenchmarks().forEach(([benchmarkId, benchmarkCases]) => {
  describe(benchmarkId, () => {
    benchmarkCases.forEach(c => c.test());
  });
});
