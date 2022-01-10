import { fold } from 'fp-ts/Either';
import { pipe } from 'fp-ts/function';
import * as t from 'io-ts';
import { createCase } from '../benchmarks';

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
        () => true
      )
    );
  };
});
