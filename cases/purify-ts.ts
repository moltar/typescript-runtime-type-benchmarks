import { Codec, string, number, boolean } from 'purify-ts';
import { createCase } from '../benchmarks';

createCase('purify-ts', 'parseSafe', () => {
  const dataType = Codec.interface({
    number,
    negNumber: number,
    maxNumber: number,
    string,
    longString: string,
    boolean,
    deeplyNested: Codec.interface({
      foo: string,
      num: number,
      bool: boolean,
    }),
  });

  return data => {
    const decodedData = dataType.decode(data);

    if (decodedData.isRight()) {
      return decodedData.extract();
    }

    throw new Error('Invalid');
  };
});
