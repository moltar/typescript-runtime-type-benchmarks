import 'reflect-metadata'
import { IsNegative, MinLength, ValidateNested } from 'class-validator'
import { transformAndValidate, transformAndValidateSync } from 'class-transformer-validator'
import { Case } from './abstract'
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
  negNumber!: number

  maxNumber!: number
  string!: string

  @MinLength(100)
  longString!: string

  boolean!:boolean

  @ValidateNested()
  deeplyNested!: DeeplyNestedType
}

export class ClassValidatorSyncCase extends Case implements Case {
  name = 'class-transformer-validator-sync'

  validate() {
    return transformAndValidateSync(DataType, this.data)
  }
}

export class ClassValidatorAsyncCase extends Case implements Case {
  name = 'class-transformer-validator-async'

  validate() {
    return transformAndValidate(DataType, this.data)
  }
}
