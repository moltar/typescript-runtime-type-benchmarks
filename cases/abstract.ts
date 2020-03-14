import clone from 'clone';
import { Data } from '../data';

export abstract class Case implements Case {
  // We cast the data as some "unknown" object, to make sure that it does not bias the validator
  // We are not using "any" type here, because that confuses "class-validator", as it can also
  // work on arrays, and it returns ambiguous "Foo | Foo[]" type if it doesn't know if input was
  // an array or not.
  protected readonly data: {};

  /**
   * Human readable case name.
   */
  abstract get name(): string;

  constructor(data: Data) {
    this.data = Object.freeze(clone(data));
  }

  /**
   * Validation implementation method.
   *
   * Method returns a `Data` object or throws when invalid data is provided.
   */
  abstract validate(): Promise<Data> | Data;
}
