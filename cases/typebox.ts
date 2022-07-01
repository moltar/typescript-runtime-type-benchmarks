import { createCase } from '../benchmarks';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { Type } from '@sinclair/typebox';

createCase('@sinclair/typebox', 'assertLoose', () => {
  const T = Type.Object({
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

  const C = TypeCompiler.Compile(T);
  return data => {
    if (!C.Check(data)) {
      throw new Error(JSON.stringify(data));
    }

    return true;
  };
});

createCase('@sinclair/typebox', 'assertStrict', () => {
  const T = Type.Object(
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

  const C = TypeCompiler.Compile(T);

  return data => {
    if (!C.Check(data)) {
      throw new Error('fail');
    }

    return true;
  };
});
