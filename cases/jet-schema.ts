// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import jetSchema from 'jet-schema/dist/index.min.mjs';
import { createCase } from '../benchmarks/index.ts';

// **** Init Schema **** //

const schema = jetSchema({
  globals: [
    { vf: isNum, default: 0 },
    { vf: isStr, default: '' },
    { vf: isBool, default: false },
  ],
});

const Schema = schema({
  number: isNum,
  negNumber: isNum,
  maxNumber: isNum,
  string: isStr,
  longString: isStr,
  boolean: isBool,
  deeplyNested: schema({
    foo: isStr,
    num: isNum,
    bool: isBool,
  }),
});

const LooseSchema = schema(
  {
    number: isNum,
    negNumber: isNum,
    maxNumber: isNum,
    string: isStr,
    longString: isStr,
    boolean: isBool,
    deeplyNested: schema(
      {
        foo: isStr,
        num: isNum,
        bool: isBool,
      },
      { safety: 'pass' },
    ),
  },
  { safety: 'pass' },
);

const StrictSchema = schema(
  {
    number: isNum,
    negNumber: isNum,
    maxNumber: isNum,
    string: isStr,
    longString: isStr,
    boolean: isBool,
    deeplyNested: schema(
      {
        foo: isStr,
        num: isNum,
        bool: isBool,
      },
      { safety: 'strict' },
    ),
  },
  { safety: 'strict' },
);

function isNum(arg: unknown): arg is number {
  return typeof arg === 'number';
}

function isStr(arg: unknown): arg is string {
  return typeof arg === 'string';
}

function isBool(arg: unknown): arg is boolean {
  return typeof arg === 'boolean';
}

// **** Run Tests **** //

// Parse "safe"
createCase('jet-schema', 'parseSafe', () => {
  return data => {
    return Schema.parse(data);
  };
});

// Parse "strict"
createCase('jet-schema', 'parseStrict', () => {
  return data => {
    return StrictSchema.parse(data);
  };
});

// Test "loose"
createCase('jet-schema', 'assertLoose', () => {
  return data => {
    LooseSchema.test(data);
    return true;
  };
});

// Test "loose"
createCase('jet-schema', 'assertStrict', () => {
  return data => {
    StrictSchema.test(data);
    return true;
  };
});
