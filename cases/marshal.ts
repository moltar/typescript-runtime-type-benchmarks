import 'reflect-metadata';
import {
  f,
  jitValidate
} from '@marcj/marshal';
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

const validator = jitValidate(DataType);

export class MarshalCase extends Case implements Case {
  name = 'marshal';

  validate() {
    const errors = validator(this.data);

    if (errors.length === 0) {
      return this.data;
    }

    throw new Error('Invalid');
  }
}
