/** @see {isLoose} ts-auto-guard:type-guard */
export interface Loose {
  number: number;
  negNumber: number;
  maxNumber: number;
  string: string;
  longString: string;
  boolean: boolean;
  deeplyNested: {
    foo: string;
    num: number;
    bool: boolean;
  };
}

/**
 * @see {isStrict} ts-auto-guard:type-guard
 * @exact
 * */
export interface Strict {
  number: number;
  negNumber: number;
  maxNumber: number;
  string: string;
  longString: string;
  boolean: boolean;
  deeplyNested: {
    foo: string;
    num: number;
    bool: boolean;
  };
}
