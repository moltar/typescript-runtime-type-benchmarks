# 📊 Benchmark Comparison of Packages with Runtime Validation and Typescript Support

## Packages Compared

* [class-validator](https://github.com/typestack/class-validator) + [class-transformer](https://github.com/typestack/class-transformer)
* [funval](https://github.com/neuledge/funval)
* [io-ts](https://github.com/gcanti/io-ts)
* [json-decoder](https://github.com/venil7/json-decoder)
* [marshal](https://github.com/marcj/marshal.ts)
* [myzod](https://github.com/davidmdm/myzod)
* [purify-ts](https://github.com/gigobyte/purify)
* [runtypes](https://github.com/pelotom/runtypes)
* [toi](https://github.com/hf/toi)
* [ts-json-validator](https://github.com/ostrowr/ts-json-validator)
* [ts-utils](https://github.com/ai-labs-team/ts-utils)
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

## Benchmark Results

### Data Type Checks

#### Node 10.x ([JSON](./results/data-type-10.x.json), [CSV](./results/data-type-10.x.csv), [SVG](./results/data-type-10.x.svg))

![Bar Graph - Node 10.x](./results/data-type-10.x.svg)

#### Node 12.x ([JSON](./results/data-type-12.x.json), [CSV](./results/data-type-12.x.csv), [SVG](./results/data-type-12.x.svg))

![Bar Graph - Node 12.x](./results/data-type-12.x.svg)

#### Node 13.x ([JSON](./results/data-type-13.x.json), [CSV](./results/data-type-13.x.csv), [SVG](./results/data-type-13.x.svg))

![Bar Graph - Node 13.x](./results/data-type-13.x.svg)

### Data Type Checks Sans `ts-json-validator`

Because `ts-json-validator` is so performant it makes it difficult to see the benchmarks for other packages.
This benchmark run includes all of the above packages, but excludes `ts-json-validator`.

#### Node 10.x ([JSON](./results/data-type-sans-ts-json-validator-10.x.json), [CSV](./results/data-type-sans-ts-json-validator-10.x.csv), [SVG](./results/data-type-sans-ts-json-validator-10.x.svg))

![Bar Graph - Node 10.x](./results/data-type-sans-ts-json-validator-10.x.svg)

#### Node 12.x ([JSON](./results/data-type-sans-ts-json-validator-12.x.json), [CSV](./results/data-type-sans-ts-json-validator-12.x.csv), [SVG](./results/data-type-sans-ts-json-validator-12.x.svg))

![Bar Graph - Node 12.x](./results/data-type-sans-ts-json-validator-12.x.svg)

#### Node 13.x ([JSON](./results/data-type-sans-ts-json-validator-13.x.json), [CSV](./results/data-type-sans-ts-json-validator-13.x.csv), [SVG](./results/data-type-sans-ts-json-validator-13.x.svg))

![Bar Graph - Node 13.x](./results/data-type-sans-ts-json-validator-13.x.svg)
