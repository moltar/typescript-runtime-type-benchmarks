import {
  createValidate,
  createHasUnknownKeys,
  createCloneExactShape,
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
//
// The strict modes only ever call this AFTER `validate` has already passed (see
// `../index.ts`), so the compile-time `{runsAfterValidation: true}` precondition
// holds. On this all-required shape the emitter then swaps the per-key scan for a
// single enumerable-key count compare (and recurses the same way into
// `deeplyNested`), which is materially faster than scanning every key.
export const hasUnknownKeys = createHasUnknownKeys<ToBeChecked>(undefined, {
  runsAfterValidation: true,
});

// Used by the `parseSafe` mode to return a value with unknown/extra keys
// removed. Rather than a delete-based strip (which deopts V8 by mutating object
// shapes with `delete`), `createCloneExactShape` builds a FRESH value from the
// declared shape, so unknown keys are dropped by construction and the input is
// never mutated — the same approach typia takes, and materially faster.
//
// 0.10 makes this clone-based strip a first-class factory; earlier versions had
// no `createX` for it, so this case recovered the `prepareForJsonSafe` primitive
// via `getRTFunction<'pjs'>()`. `createCloneExactShape` is the direct, intended
// replacement.
export const cloneWithoutUnknownKeys = createCloneExactShape<ToBeChecked>();
