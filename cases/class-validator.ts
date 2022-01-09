import { Type } from 'class-transformer';
import { transformAndValidateSync } from 'class-transformer-validator';
import {
  IsBoolean,
  IsNegative,
  IsNumber,
  IsString,
  ValidateNested,
} from 'class-validator';
import 'reflect-metadata';
import { createCase } from '../benchmarks';

createCase('class-transformer-validator-sync', 'assertLoose', () => {
  class DeeplyNestedType {
    @IsString()
    foo!: string;

    @IsNumber()
    num!: number;

    @IsBoolean()
    bool!: boolean;
  }

  class DataType {
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

  return data => {
    // We cast the data as some "unknown" object, to make sure that it does not bias the validator
    // We are not using "any" type here, because that confuses "class-validator", as it can also
    // work on arrays, and it returns ambiguous "Foo | Foo[]" type if it doesn't know if input was
    // an array or not.
    transformAndValidateSync(DataType, data as {});

    return true;
  };
});
