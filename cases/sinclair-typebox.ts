import { Type } from '@sinclair/typebox';
import { TypeCompiler } from '@sinclair/typebox/compiler';
import { createCase } from '../benchmarks';

createCase('@sinclair/typebox', 'assertLoose', () => {
  const dataType = Type.Object({
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

  const compiledType = TypeCompiler.Compile(dataType);

  return data => {
    const check = compiledType.Check(data);

    if (!check) {
      throw new Error('validation failure');
    }

    return true;
  };
});

createCase('@sinclair/typebox', 'assertStrict', () => {
  const dataType = Type.Object(
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

  const compiledType = TypeCompiler.Compile(dataType);

  return data => {
    const check = compiledType.Check(data);

    if (!check) {
      throw new Error('validation failure');
    }

    return true;
  };
});
