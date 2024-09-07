import { Benchmark } from './helpers/types';
import { validateData } from './parseSafe';

type Fn = (data: unknown) => boolean;

/**
 * Check that an object conforms to the schema.
 *
 * Ignore any extra keys in input objects.
 *
 * Such a validation mode is highly unsafe when used on untrusted input.
 *
 * But not checking for unknown/extra keys in records may provide massive
 * speedups and may suffice in certain scenarios.
 */
export class AssertLoose extends Benchmark<Fn> {
  run() {
    this.fn(validateData);
  }

  test() {
    describe(this.moduleName, () => {
      test('should validate the data', () => {
        expect(this.fn(validateData)).toBe(true);
      });

      test('should validate with unknown attributes', () => {
        const dataWithExtraKeys = {
          ...validateData,
          extraAttribute: 'foo',
        };

        expect(this.fn(dataWithExtraKeys)).toBe(true);
      });

      test('should validate with unknown attributes (nested)', () => {
        const dataWithExtraNestedKeys = {
          ...validateData,
          deeplyNested: {
            ...validateData.deeplyNested,
            extraNestedAttribute: 'bar',
          },
        };

        expect(this.fn(dataWithExtraNestedKeys)).toBe(true);
      });

      test('should throw on missing attributes', () => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = {
          ...validateData,
        };

        delete data.number;

        expect(() => this.fn(data)).toThrow();
      });

      test('should throw on data with an invalid attribute', () => {
        expect(() =>
          this.fn({
            ...validateData,
            number: 'foo',
          })
        ).toThrow();
      });
    });
  }
}
