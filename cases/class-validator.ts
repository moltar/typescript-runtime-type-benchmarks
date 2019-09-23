import 'reflect-metadata'
import { IsNegative, MinLength } from 'class-validator'
import { Type } from 'class-transformer'
import { transformAndValidate, transformAndValidateSync } from 'class-transformer-validator'
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

  @Type(() => DeeplyNestedType)
  deeplyNested!: DeeplyNestedType
}

export function caseClassValidatorSync(data: Data) {
  return transformAndValidateSync(DataType, data)
}

export function caseClassValidatorAsync(data: Data) {
  return transformAndValidate(DataType, data)
}