import { TypeSystemPolicy } from '@sinclair/typebox/system';
import { Type } from '@sinclair/typebox';

// ┌──[TypeScriptPolicy]──────────────────────────────────────────────────────────┐
// │                                                                              │
// │ const x: {} = []      - Allowed in TypeScript Strict                         │
// │                                                                              │
// │ const x: number = NaN - Allowed in TypeScript Strict                         │
// │                                                                              │
// └──────────────────────────────────────────────────────────────────────────────┘

TypeSystemPolicy.AllowArrayObject = true; // match: typia, ts-runtime-checks
TypeSystemPolicy.AllowNaN = true; // match: valita, typia, ts-runtime-checks, to-typed, spectypes, @sapphire/shapeshift, ok-computer, myzod, jointz, computed-types, bueno

export const Loose = Type.Object({
  number: Type.Number(),
  negNumber: Type.Number(),
  maxNumber: Type.Number(),
  string: Type.String(),
  longString: Type.String(),
  boolean: Type.Boolean(),
  deeplyNested: Type.Object({
    foo: Type.String(),
    num: Type.Number(),
    bool: Type.Boolean(),
  }),
});
export const Strict = Type.Object(
  {
    number: Type.Number(),
    negNumber: Type.Number(),
    maxNumber: Type.Number(),
    string: Type.String(),
    longString: Type.String(),
    boolean: Type.Boolean(),
    deeplyNested: Type.Object(
      {
        foo: Type.String(),
        num: Type.Number(),
        bool: Type.Boolean(),
      },
      { additionalProperties: false }
    ),
  },
  { additionalProperties: false }
);
