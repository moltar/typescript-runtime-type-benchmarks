import {
  objectDecoder,
  stringDecoder,
  numberDecoder,
  boolDecoder,
} from 'json-decoder';
import { createCase } from '../benchmarks';

createCase('json-decoder', 'parseSafe', () => {
  const dataType = objectDecoder({
    number: numberDecoder,
    negNumber: numberDecoder,
    maxNumber: numberDecoder,
    string: stringDecoder,
    longString: stringDecoder,
    boolean: boolDecoder,
    deeplyNested: objectDecoder({
      foo: stringDecoder,
      num: numberDecoder,
      bool: boolDecoder,
    }),
  });

  return data => {
    const res = dataType.decode(data);

    if (res.type === 'ERR') {
      throw new Error(res.message);
    }

    return res.value;
  };
});
