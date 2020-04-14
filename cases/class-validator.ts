import 'reflect-metadata';
import {
  IsNegative,
  ValidateNested,
  IsBoolean,
  IsNumber,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  transformAndValidate,
  transformAndValidateSync,
} from 'class-transformer-validator';
import { Case } from './abstract';
import { Data } from '../data';

type DeeplyNested = Data['deeplyNested'];

class DeeplyNestedType implements DeeplyNested {
  @IsString()
  foo!: string;

  @IsNumber()
  num!: number;

  @IsBoolean()
  bool!: boolean;
}

class DataType implements Data {
  @IsNumber()
  number!: number;

  @IsNegative()
  negNumber!: number;

  @IsNumber()
  maxNumber!: number;

  @IsString()
  string!: string;

  @IsString()
  longString!: string;

  @IsBoolean()
  boolean!: boolean;

  @ValidateNested()
  @Type(() => DeeplyNestedType)
  deeplyNested!: DeeplyNestedType;
}

export class ClassValidatorSyncCase extends Case implements Case {
  name = 'class-transformer-validator-sync';

  validate() {
    // We cast the data as some "unknown" object, to make sure that it does not bias the validator
    // We are not using "any" type here, because that confuses "class-validator", as it can also
    // work on arrays, and it returns ambiguous "Foo | Foo[]" type if it doesn't know if input was
    // an array or not.
    return transformAndValidateSync(DataType, this.data as {});
  }
}

export class ClassValidatorAsyncCase extends Case implements Case {
  name = 'class-transformer-validator-async';

  validate() {
    return transformAndValidate(DataType, this.data as {});
  }
}
