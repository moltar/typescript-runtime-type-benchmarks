import 'reflect-metadata';
import { f, validatedPlainToClass } from '@marcj/marshal';
import { Data } from '../data';
import { Case } from './abstract';

type DeeplyNested = Data['deeplyNested'];

class DeeplyNestedType implements DeeplyNested {
  @f
  foo!: string;

  @f
  num!: number;

  @f
  bool!: boolean;
}

class DataType implements Data {
  @f
  number!: number;

  @f
  negNumber!: number;

  @f
  maxNumber!: number;

  @f
  string!: string;

  @f
  longString!: string;

  @f
  boolean!: boolean;

  @f.type(DeeplyNestedType)
  deeplyNested!: DeeplyNestedType;
}

export class MarshalCase extends Case implements Case {
  name = 'marshal';

  validate() {
    return validatedPlainToClass(DataType, this.data);
  }
}
