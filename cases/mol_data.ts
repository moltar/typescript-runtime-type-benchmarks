import {
  $mol_data_number as Numb,
  $mol_data_string as Str,
  $mol_data_record as Rec,
  $mol_data_boolean as Bool,
} from 'mol_data_all';

import { createCase } from '../benchmarks';

createCase('$mol_data', 'parseSafe', () => {
  return Rec({
    number: Numb,
    negNumber: Numb,
    maxNumber: Numb,
    string: Str,
    longString: Str,
    boolean: Bool,
    deeplyNested: Rec({
      foo: Str,
      num: Numb,
      bool: Bool,
    }),
  });
});

createCase('$mol_data', 'assertLoose', () => {
  const dataType = Rec({
    number: Numb,
    negNumber: Numb,
    maxNumber: Numb,
    string: Str,
    longString: Str,
    boolean: Bool,
    deeplyNested: Rec({
      foo: Str,
      num: Numb,
      bool: Bool,
    }),
  });

  return data => {
    dataType(data as never);
    return true;
  };
});
