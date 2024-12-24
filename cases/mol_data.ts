import $ from 'mol_data_all';

const {
  $mol_data_number: Numb,
  $mol_data_record: Rec,
  $mol_data_string: Str,
  $mol_data_boolean: Bool,
} = $;

import { createCase } from '../benchmarks/index.ts';

createCase('$mol_data', 'parseSafe', () => {
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return dataType(data as any);
  };
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dataType(data as any);
    return true;
  };
});
