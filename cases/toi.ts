import * as toi from '@toi/toi';
import { createCase } from '../benchmarks';

createCase('toi', 'parseStrict', () => {
  const obj = () => toi.required().and(toi.obj.isplain());
  const req = () => toi.required();
  const num = () => toi.num.is();
  const str = () => toi.str.is();

  const isValid = obj().and(
    toi.obj.keys({
      number: req().and(num()),
      negNumber: req().and(num()),
      maxNumber: req().and(num()),
      string: req().and(str()),
      longString: req().and(str()),
      boolean: req().and(toi.bool.is()),
      deeplyNested: obj().and(
        toi.obj.keys({
          foo: req().and(str()),
          num: req().and(num()),
          bool: req().and(toi.bool.is()),
        })
      ),
    })
  );

  return data => {
    isValid(data);

    return data;
  };
});

createCase('toi', 'assertStrict', () => {
  const obj = () => toi.required().and(toi.obj.isplain());
  const req = () => toi.required();
  const num = () => toi.num.is();
  const str = () => toi.str.is();

  const isValid = obj().and(
    toi.obj.keys({
      number: req().and(num()),
      negNumber: req().and(num()),
      maxNumber: req().and(num()),
      string: req().and(str()),
      longString: req().and(str()),
      boolean: req().and(toi.bool.is()),
      deeplyNested: obj().and(
        toi.obj.keys({
          foo: req().and(str()),
          num: req().and(num()),
          bool: req().and(toi.bool.is()),
        })
      ),
    })
  );

  return data => {
    isValid(data);

    return true;
  };
});
