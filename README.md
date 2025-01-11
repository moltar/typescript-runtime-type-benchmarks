# 📊 Benchmark Comparison of Packages with Runtime Validation and TypeScript Support

- - - -
**⚡⚠ Benchmark results have changed after switching to isolated node processes for each benchmarked package, see [#864](https://github.com/moltar/typescript-runtime-type-benchmarks/issues/864) ⚠⚡**
- - - -

## Benchmark Results

[![Fastest Packages - click to view details](docs/results/preview.svg)](https://moltar.github.io/typescript-runtime-type-benchmarks)

[click here for result details](https://moltar.github.io/typescript-runtime-type-benchmarks)

## Packages Compared

* [aeria](https://github.com/aeria-org/aeria)
* [ajv](https://ajv.js.org/)
* [ArkType](https://github.com/arktypeio/arktype)
* [banditypes](https://github.com/thoughtspile/banditypes)
* [bueno](https://github.com/philipnilsson/bueno)
* [caketype](https://github.com/justinyaodu/caketype)
* [class-validator](https://github.com/typestack/class-validator) + [class-transformer](https://github.com/typestack/class-transformer)
* [computed-types](https://github.com/neuledge/computed-types)
* [decoders](https://github.com/nvie/decoders)
* [deepkit](https://deepkit.io/)
* [@effect/schema](https://github.com/Effect-TS/effect/blob/main/packages/schema/README.md)
* [io-ts](https://github.com/gcanti/io-ts)
* [jet-schema](https://github.com/seanpmaxwell/jet-schema)
* [jointz](https://github.com/moodysalem/jointz)
* [json-decoder](https://github.com/venil7/json-decoder)
* [@mojotech/json-type-validaton](https://github.com/mojotech/json-type-validation)
* [$mol_data](https://github.com/hyoo-ru/mam_mol/blob/master/data/README.md)
* [@mondrian-framework/model](https://mondrianframework.com)
* [myzod](https://github.com/davidmdm/myzod)
* [ok-computer](https://github.com/richardscarrott/ok-computer)
* [pure-parse](https://github.com/johannes-lindgren/pure-parse)
* [purify-ts](https://github.com/gigobyte/purify)
* [parse-dont-validate](https://github.com/Packer-Man/parse-dont-validate)
* [Paseri](https://github.com/vbudovski/paseri)
* [r-assign](https://github.com/micnic/r-assign)
* [rescript-schema](https://github.com/DZakh/rescript-schema)
* [rulr](https://github.com/ryansmith94/rulr)
* [runtypes](https://github.com/pelotom/runtypes)
* [@sapphire/shapeshift](https://github.com/sapphiredev/shapeshift)
* [@sinclair/typebox](https://github.com/sinclairzx81/typebox)
* [simple-runtypes](https://github.com/hoeck/simple-runtypes)
* [spectypes](https://github.com/iyegoroff/spectypes)
* [succulent](https://github.com/aslilac/succulent)
* [superstruct](https://github.com/ianstormtaylor/superstruct)
* [suretype](https://github.com/grantila/suretype)
* [tiny-schema-validator](https://github.com/5alidz/tiny-schema-validator)
* [to-typed](https://github.com/jsoldi/to-typed)
* [toi](https://github.com/hf/toi)
* [ts-auto-guard](https://github.com/rhys-vdw/ts-auto-guard)
* [ts-interface-checker](https://github.com/gristlabs/ts-interface-checker)
* [ts-json-validator](https://github.com/ostrowr/ts-json-validator)
* [ts-runtime-checks](https://github.com/GoogleFeud/ts-runtime-checks)
* [tson](https://github.com/skarab42/tson)
* [ts-utils](https://github.com/ai-labs-team/ts-utils)
* [type-predicate-generator](https://github.com/peter-leonov/typescript-predicate-generator)
* [typia](https://github.com/samchon/typia)
* [@typeofweb/schema](https://github.com/typeofweb/schema)
* [unknownutil](https://github.com/lambdalisue/deno-unknownutil)
* [valibot](https://github.com/fabian-hiller/valibot)
* [valita](https://github.com/badrap/valita)
* [Vality](https://github.com/jeengbe/vality)
* [yup](https://github.com/jquense/yup)
* [zod](https://github.com/vriad/zod)

## Criteria

### Validation

These packages are capable of validating the data for type correctness.

E.g. if `string` was expected, but a `number` was provided, the validator should fail.

### Interface

It has a validator function or method that returns a valid type casted value or throws.

```ts
const data: any = {}

// `res` is now type casted to the right type
const res = isValid(data)
```

Or it has a type guard function that in a truthy block type casts the value.

```ts
const data: any = {}

function isMyDataValid(data: any) {
  // isValidGuard is the type guard function provided by the package
  if (isValidGuard(data)) {
    // data here is "guarded" and therefore inferred to be of the right type
    return data
  }

  throw new Error('Invalid!')
}

// `res` is now type casted to the right type
const res = isMyDataValid(data)
```

## Local Development

* `npm run start` - run benchmarks for all modules
* `npm run start run zod myzod valita` - run benchmarks only for a few selected modules
* `npm run docs:serve` - result viewer
* `npm run test` - run tests on all modules

## Adding a new node version

* update node version matrix in `.github/workflows/pr.yml` and `.github/workflows/release.yml`
* update `NODE_VERSIONS` in `docs/dist/app.tsx` and run `npm run docs:build`
* optionally set `NODE_VERSION_FOR_PREVIEW` in `benchmarks/helpers/main.ts`

## Test cases

* **Safe Parsing**
  * Checks the input object against a schema and returns it.
  * Raises an error if the input object does not conform to the schema (e.g., a type mismatch or missing attribute).
  * Removes any extra keys in the input object that are not defined in the schema.

* **Strict Parsing**
  * Checks the input object against a schema and returns it.
  * Raises an error if the input object does not conform to the schema (e.g., a type mismatch or missing attribute).
  * Raises an error if the input object contains extra keys.

* **Loose Assertion**
  * Checks the input object against a schema.
  * Raises an exception if the input object does not match the schema.
  * Allows extra keys without raising errors.
  * Returns true if data is valid.

* **Strict Assertion**
  * Checks the input object against a schema.
  * Raises an exception if the input object does not match the schema.
  * Raises an error if the input object or any nested input objects contain extra keys.
  * Returns true if data is valid.
