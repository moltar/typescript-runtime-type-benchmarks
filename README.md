# 📊 Benchmark Comparison of Packages with Runtime Validation and TypeScript Support

- - - -
**⚡⚠ Benchmark results have changed after switching to isolated node processes for each benchmarked package, see [#864](https://github.com/moltar/typescript-runtime-type-benchmarks/issues/864) ⚠⚡**
- - - -

## Benchmark Results

[![Fastest Packages - click to view details](docs/results/preview.svg)](https://moltar.github.io/typescript-runtime-type-benchmarks)

[click here for result details](https://moltar.github.io/typescript-runtime-type-benchmarks)

## Packages Compared

* [ajv](https://ajv.js.org/)
* [bueno](https://github.com/philipnilsson/bueno)
* [class-validator](https://github.com/typestack/class-validator) + [class-transformer](https://github.com/typestack/class-transformer)
* [computed-types](https://github.com/neuledge/computed-types)
* [decoders](https://github.com/nvie/decoders)
* [io-ts](https://github.com/gcanti/io-ts)
* [jointz](https://github.com/moodysalem/jointz)
* [json-decoder](https://github.com/venil7/json-decoder)
* [marshal](https://github.com/marcj/marshal.ts)
* [@mojotech/json-type-validaton](https://github.com/mojotech/json-type-validation)
* [myzod](https://github.com/davidmdm/myzod)
* [ok-computer](https://github.com/richardscarrott/ok-computer)
* [purify-ts](https://github.com/gigobyte/purify)
* [parse-dont-validate](https://github.com/Packer-Man/parse-dont-validate)
* [r-assign](https://github.com/micnic/r-assign)
* [rulr](https://github.com/ryansmith94/rulr)
* [runtypes](https://github.com/pelotom/runtypes)
* [@sapphire/shapeshift](https://github.com/sapphiredev/shapeshift)
* [@sinclair/typebox](https://github.com/sinclairzx81/typebox)
* [simple-runtypes](https://github.com/hoeck/simple-runtypes)
* [spectypes](https://github.com/iyegoroff/spectypes)
* [superstruct](https://github.com/ianstormtaylor/superstruct)
* [suretype](https://github.com/grantila/suretype)
* [toi](https://github.com/hf/toi)
* [ts-interface-checker](https://github.com/gristlabs/ts-interface-checker)
* [ts-json-validator](https://github.com/ostrowr/ts-json-validator)
* [ts-runtime-checks](https://github.com/GoogleFeud/ts-runtime-checks)
* [tson](https://github.com/skarab42/tson)
* [ts-utils](https://github.com/ai-labs-team/ts-utils)
* [@typeofweb/schema](https://github.com/typeofweb/schema)
* [valita](https://github.com/badrap/valita)
* [Vality](https://github.com/jeengbe/vality)
* [yup](https://github.com/jquense/yup)
* [zod](https://github.com/vriad/zod)

## Adding Your Own Package

- Add it to `dependencies`
- Add to the above list
- Add it to the `cases` array in [`cases/index.ts`](./cases/index.ts)
- Create your cases file (see below)
- Import your cases file in [`test/benchmarks.test.ts`](./test/benchmarks.test.ts)

### Adding Your Cases

- Create a new file in [`cases/`](./cases/)
- Add your test cases

```ts
import { number, string, boolean, validate } from 'yourPackage';
import { addCase } from '../benchmarks';

const dataType = {
  number: number,
  negNumber: number,
  maxNumber: number,
  string: string,
  longString: string,
  boolean: boolean,
  deeplyNested: {
    foo: string,
    num: number,
    bool: boolean,
  },
};

// Return the data if it is valid, throw otherwise. Accept extra properties
addCase('yourPackage', 'parseSafe', data => {
  const res = validate(dataType, data);

  if (res.valid) return res.data;
  throw new Error('Invalid!');
});

// Return the data if it is valid, throw otherwise. Don't accept extra properties
addCase('yourPackage', 'parseStrict', data => {
  const res = validate(dataType, data, {
    bail: true,
    strict: true,
    allowExtraProperties: false,
  });

  if (res.valid) return res.data;
  throw new Error('Invalid!');
});

// Return true if the data is valid, throw otherwise. Accept extra properties
addCase('yourPackage', 'assertLoose', data => {
  const res = validate(dataType, data);

  if (res.valid) return true;
  throw new Error('Invalid!');
});

// Return true if the data is valid, throw otherwise. Don't accept extra properties
addCase('yourPackage', 'assertStrict', data => {
  const res = validate(dataType, data, {
    allowExtraProperties: false,
  });

  if (res.valid) return true;
  throw new Error('Invalid!');
});
```
- Verify that your cases are working by runnning `npm run test`

## Local Development

* `npm run start` - run benchmarks for all modules
* `npm run start run zod myzod vality` - run benchmarks only for a few selected modules
* `npm run docs:serve` - result viewer
* `npm run test` - run tests on all modules
