import 'reflect-metadata';
import {
  f,
  validate,
  PropertyValidator,
  PropertyValidatorError,
} from '@marcj/marshal';
import { Data } from '../data';
import { Case } from './abstract';

class IsNegative implements PropertyValidator {
  validate<T>(value: number) {
    if (value > 0) {
      return new PropertyValidatorError(
        'IsNegative',
        'Number must be negative.'
      );
    }
  }
}

function MinLengthFactory(minLength: number) {
  return class MinLength implements PropertyValidator {
    validate<T>(value: string) {
      if (value.length < minLength) {
        return new PropertyValidatorError(
          'MinLength',
          `String must have minimum length of ${minLength}.`
        );
      }
    }
  };
}

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

  @f.validator(IsNegative)
  negNumber!: number;

  @f
  maxNumber!: number;

  @f
  string!: string;

  @f.validator(MinLengthFactory(100))
  longString!: string;

  @f
  boolean!: boolean;

  @f.type(DeeplyNestedType)
  deeplyNested!: DeeplyNestedType;
}

export class MarshalCase extends Case implements Case {
  name = 'marshal';

  validate() {
    const errors = validate(DataType, this.data);
    if (errors.length === 0) {
      return this.data;
    }

    throw new Error('Invalid');
  }
}
