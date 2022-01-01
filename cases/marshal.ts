import 'reflect-metadata';
import { f, validatesFactory } from '@marcj/marshal';
import { createCase } from '../benchmarks';

createCase('marshal', 'validateLoose', () => {
  class DeeplyNestedType {
    @f
    foo!: string;

    @f
    num!: number;

    @f
    bool!: boolean;
  }

  class DataType {
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

  const checkData = validatesFactory(DataType);

  return (data: any) => {
    if (checkData(data)) {
      return data;
    }

    throw new Error('Invalid');
  };
});
