import {
  createValidate,
  createHasUnknownKeys,
  createStripUnknownKeys,
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

// Returns a copy with unknown/extra keys removed (recursively). Used by the
// `parseSafe` mode. Typed to the checked shape for the benchmark harness.
export const stripUnknownKeys = createStripUnknownKeys<ToBeChecked>() as (
  value: unknown,
) => ToBeChecked;
