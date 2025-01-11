import { Benchmark } from './helpers/types.ts';
import { validateData } from './parseSafe.ts';

type Fn = (data: unknown) => boolean;

/**
 * Check that an object conforms to the schema.
 *
 * Raise errors if any extra keys not present in the schema are found.
 */
export class AssertStrict extends Benchmark<Fn> {
  run() {
    this.fn(validateData);
  }

  test(describe: jest.Describe, expect: jest.Expect, test: jest.It) {
    describe(this.moduleName, () => {
      test('should validate the data', () => {
        expect(this.fn(validateData)).toBe(true);
      });

      test('should throw on unknown attributes', () => {
        const dataWithExtraKeys = {
          ...validateData,
          extraAttribute: 'foo',
        };

        expect(() => this.fn(dataWithExtraKeys)).toThrow();
      });

      test('should throw on unknown attributes (nested)', () => {
        const dataWithExtraNestedKeys = {
          ...validateData,
          deeplyNested: {
            ...validateData.deeplyNested,
            extraNestedAttribute: 'bar',
          },
        };

        expect(() => this.fn(dataWithExtraNestedKeys)).toThrow();
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
          }),
        ).toThrow();
      });
    });
  }
}
