import clone from 'clone'
import { Data } from '../data'

export interface ICase {
  /**
   * Human readable case name.
  */
  name: string

  /**
   * Validation implementation method.
   *
   * Method returns a `Data` object or throws when invalid data is provided.
  */
  validate(): Promise<Data> | Data
}

export abstract class Case implements ICase {
  protected readonly data: Data

  public abstract get name(): string

  public constructor(data: Data) {
    this.data = Object.freeze(clone(data))
  }

  public abstract validate(): Promise<Data> | Data
}
