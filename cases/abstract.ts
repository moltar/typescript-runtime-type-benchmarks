import clone from 'clone';
import { Data } from '../data';

export abstract class Case implements Case {
  protected readonly data: unknown;

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
  abstract validate(): PromiseLike<Data> | Data;
}
