import 'reflect-metadata'
import { f, validatedPlainToClass, PropertyValidator, PropertyValidatorError } from '@marcj/marshal'
import { Data } from '../data'

class IsNegative implements PropertyValidator {
  validate<T>(value: number) {
    if (value > 0) {
      return new PropertyValidatorError('IsNegative', 'Number must be negative.')
    }
  }
}

function MinLengthFactory (minLength: number) {
  return class MinLength implements PropertyValidator {
    validate<T>(value: string) {
      if (value.length < minLength) {
        return new PropertyValidatorError('MinLength', `String must have minimum length of ${minLength}.`)
      }
    }
  }
}

type DeeplyNested = Data['deeplyNested']

class DeeplyNestedType implements DeeplyNested {
  @f
  foo!: string

  @f
  num!: number

  @f
  bool!: boolean
}

class DataType implements Data {
  @f
  number!: number

  @f.validator(IsNegative)
  neg_number!: number

  @f
  max_number!: number

  @f
  string!: string

  @f.validator(MinLengthFactory(100))
  long_string!: string

  @f
  boolean!: boolean

  @f.type(DeeplyNestedType)
  deeplyNested!: DeeplyNestedType
}

export function caseMashal(data: Data) {
  return validatedPlainToClass(DataType, data)
}
