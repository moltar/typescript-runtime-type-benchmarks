// Anti-dead-code-elimination sink (a "blackhole").
//
// Some validation modes return a value the benchmark body would otherwise
// discard. When that value is a freshly allocated object — e.g. a `parseSafe`
// implementation that returns an unknown-key-stripped CLONE of the input
// (typia, ts-runtypes' `prepareForJson`, …) rather than mutating in place — a
// JIT can prove the allocation is unobservable and delete the whole call via
// escape analysis. That inflates such libraries into a meaningless outlier (the
// same artifact that makes `assertLoose` unreliable), so the benchmark would no
// longer measure the work they actually do.
//
// Routing each result through `sink()` makes the value escape, so the JIT must
// keep the computation. Mutating/in-place implementations pay only a single
// extra property store per iteration.
let hole: unknown;

/**
 * Consume a benchmark result so it cannot be dead-code-eliminated.
 *
 * The never-taken guard reads `hole`, so the optimizer cannot prove the store
 * is dead (it cannot know the stored value is never the `sink` function). This
 * keeps the sink self-contained: no cooperation from the runner is required.
 */
export function sink(value: unknown): void {
  hole = value;
  if (hole === sink) {
    throw new Error('unreachable');
  }
}
