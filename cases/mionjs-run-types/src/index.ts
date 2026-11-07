import { createValidateFn, createRemoveUnknownKeysFn } from '@mionjs/run-types';

// `@mionjs/run-types` (https://mion.io/runtypes) compiles validators from plain
// TypeScript types ahead of time. It is unrelated to the older, unscoped
// `runtypes` package.
//
// The plain TypeScript type below *is* the schema: there is no separate schema
// DSL. The mion compiler reads this type at build time and generates the
// concrete validator functions, which are emitted into `../build` and consumed
// by the benchmark case in `../index.ts`.
//
// Options passed to the factories are read at build time (they must be object
// literals) and select which function the compiler emits.

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

// The number check (`numberMode`) is set project-wide to `'typeof'` in
// `../build.mjs`, matching ajv, typia, typebox and JSON Schema: a `number` is
// any value with `typeof v === 'number'`. mion's default (`'isFinite'`) also
// rejects `NaN` and `Infinity`, which is stricter than the type and than what
// the other libraries in this benchmark check.

// Loose type guard. Ignores unknown/extra keys (does not reject them).
export const validate = createValidateFn<ToBeChecked>();

// Strict type guard: matches the type AND carries no undeclared property at any
// level, checked in a single pass (`checkUnknowns`).
export const validateStrict = createValidateFn<ToBeChecked>(undefined, {
  checkUnknowns: true,
});

// Used by the `parseSafe` mode to return a value with unknown/extra keys
// removed. It builds a FRESH value from the declared shape, so unknown keys are
// dropped by construction and the input is never mutated (frozen inputs work).
export const removeUnknownKeys = createRemoveUnknownKeysFn<ToBeChecked>();
