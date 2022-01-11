import 'reflect-metadata';
import { f, validatesFactory } from '@marcj/marshal';
import { UnknownData, createCase } from '../benchmarks';

createCase('marshal', 'assertLoose', () => {
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

  return (data: UnknownData) => {
    if (checkData(data)) {
      return true;
    }

    throw new Error('Invalid');
  };
});
