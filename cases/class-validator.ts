import 'reflect-metadata'
import { IsNegative, MinLength, ValidateNested } from 'class-validator'
import { transformAndValidate, transformAndValidateSync } from 'class-transformer-validator'
import { Case, ICase } from './abstract'
import { Data } from '../data'

type DeeplyNested = Data['deeplyNested']

class DeeplyNestedType implements DeeplyNested {
  foo!: string
  num!: number
  bool!: boolean
}

class DataType implements Data {
  number!: number

  @IsNegative()
  neg_number!: number

  max_number!: number
  string!: string

  @MinLength(100)
  long_string!: string

  boolean!:boolean

  @ValidateNested()
  deeplyNested!: DeeplyNestedType
}

export class ClassValidatorSyncCase extends Case implements ICase {
  name = 'class-transformer-validator-sync'

  validate() {
    return transformAndValidateSync(DataType, this.data)
  }
}

export class ClassValidatorAsyncCase extends Case implements ICase {
  name = 'class-transformer-validator-async'

  validate() {
    return transformAndValidate(DataType, this.data)
  }
}
