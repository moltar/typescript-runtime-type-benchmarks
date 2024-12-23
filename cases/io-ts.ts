import { fold } from 'fp-ts/lib/Either.js';
import { pipe } from 'fp-ts/lib/function.js';
import * as t from 'io-ts';
import { createCase } from '../benchmarks/index.ts';

createCase('io-ts', 'assertLoose', () => {
  const dataType = t.type({
    number: t.Int,
    negNumber: t.number,
    maxNumber: t.number,
    string: t.string,
    longString: t.string,
    boolean: t.boolean,
    deeplyNested: t.type({
      foo: t.string,
      num: t.number,
      bool: t.boolean,
    }),
  });

  return data => {
    return pipe(
      dataType.decode(data),
      fold(
        errors => {
          throw errors;
        },
        () => true,
      ),
    );
  };
});
