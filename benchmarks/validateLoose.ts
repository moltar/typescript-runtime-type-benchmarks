import { Benchmark } from './helpers/types';
import { validateData } from './validate';

type Fn = (data: unknown) => void;

/**
 * Like validate but keep unknown keys in the result.
 *
 * Such a validation mode is highly unsafe when used in backends but might be
 * useful in old codebases.
 * Not checking for unknown/extra keys in records may provide massive speedups.
 */
export class ValidateLoose extends Benchmark<Fn> {
  run() {
    this.fn(validateData);
  }

  test() {
    describe(this.moduleName, () => {
      test(`should validate the data`, () => {
        expect(this.fn(validateData)).toEqual(validateData);
      });

      test(`should validate with unknown attributes and keep them in the validated result`, () => {
        const dataWithExtraKeys = {
          ...validateData,
          extraAttribute: 'foo',
        };

        expect(this.fn(dataWithExtraKeys)).toEqual(dataWithExtraKeys);
      });

      test(`should validate with unknown attributes and keep them in the validated result (nested)`, () => {
        const dataWithExtraNestedKeys = {
          ...validateData,
          deeplyNested: {
            ...validateData.deeplyNested,
            extraNestedAttribute: 'bar',
          },
        };

        expect(this.fn(dataWithExtraNestedKeys)).toEqual(
          dataWithExtraNestedKeys
        );
      });

      test(`should throw on missing attributes`, () => {
        const data: any = {
          ...validateData,
        };

        delete data.number;

        expect(() => this.fn(data)).toThrow();
      });

      test(`should throw on data with an invalid attribute`, () => {
        expect(() =>
          this.fn({
            ...validateData,
            number: 'foo',
          } as any)
        ).toThrow();
      });
    });
  }
}
