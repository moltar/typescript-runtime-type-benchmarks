import {
  createValidate,
  createHasUnknownKeys,
  getRTFunction,
  type InjectTypeFnArgs,
  type PrepareForJsonFn,
} from '@ts-runtypes/core';

// This is the scoped `@ts-runtypes/*` project (https://github.com/MionKit/ts-run-types),
// which is distinct from the older, unrelated unscoped `runtypes` package.
//
// The plain TypeScript type below *is* the schema: there is no separate schema
// DSL. The `ts-runtypes` compiler reads this type at build time and generates
// the concrete validator/serializer implementations, which are emitted into
// `../build` and consumed by the benchmark case in `../index.ts`.

export interface ToBeChecked {
  number: number;
  negNumber: number;
  maxNumber: number;
  string: string;
  longString: string;
  boolean: boolean;
  deeplyNested: {
    foo: string;
    num: number;
    bool: boolean;
  };
}

// Loose type guard. Ignores unknown/extra keys (does not reject them).
export const validate = createValidate<ToBeChecked>();

// Returns true when the value carries keys not declared in `ToBeChecked`,
// recursively (including nested objects). Used to build the strict modes.
export const hasUnknownKeys = createHasUnknownKeys<ToBeChecked>();

// Used by the `parseSafe` mode to return a value with unknown/extra keys
// removed. Rather than the delete-based `stripUnknownKeys` (which deopts V8 by
// mutating shapes with `delete`), this uses the clone-based `prepareForJsonSafe`
// primitive: it builds a FRESH value from the declared shape, so unknown keys
// are dropped by construction and the input is never mutated — the same
// approach typia takes, and materially faster.
//
// `prepareForJsonSafe` is a value-level JSON transform that has no `createX`
// factory; it is recovered via `getRTFunction<'pjs'>()` from an
// `InjectTypeFnArgs<T, 'pjs'>` marker the plugin injects at this wrapper's call
// site. (The `'pj'` / plain `prepareForJson` sibling is the *mutate* variant,
// which for this already-JSON-safe type degrades to identity and would NOT drop
// unknown keys.)
function recoverStripClone<T>(
  injected?: InjectTypeFnArgs<T, 'pjs'>,
): PrepareForJsonFn {
  return getRTFunction<'pjs'>(injected);
}

export const cloneWithoutUnknownKeys = recoverStripClone<ToBeChecked>() as (
  value: unknown,
) => ToBeChecked;
