import { Benchmark } from './helpers/types';
import { validateData } from './validate';

type Fn = (data: unknown) => void;

/**
 * Like validate but throw on unknown (extra) keys in objects.
 */
export class ValidateStrict extends Benchmark<Fn> {
  run() {
    this.fn(validateData);
  }

  test() {
    describe(this.moduleName, () => {
      test(`should validate the data`, () => {
        expect(this.fn(validateData)).toEqual(validateData);
      });

      test(`should throw on invalid attribute type`, () => {
        expect(() =>
          this.fn({
            ...validateData,
            number: 'foo',
          } as any)
        ).toThrow();
      });

      test(`should throw on extra attributes`, () => {
        expect(() =>
          this.fn({
            ...validateData,
            extraAttribute: true,
          } as any)
        ).toThrow();
      });

      test(`should throw on extra nested attributes`, () => {
        expect(() =>
          this.fn({
            ...validateData,
            deeplyNested: {
              ...validateData.deeplyNested,
              extraDeepAttribute: true,
            },
          } as any)
        ).toThrow();
      });

      test(`should throw on missing attributes`, () => {
        const data: any = {
          ...validateData,
        };

        delete data.number;

        expect(() => this.fn(data)).toThrow();
      });
    });
  }
}
