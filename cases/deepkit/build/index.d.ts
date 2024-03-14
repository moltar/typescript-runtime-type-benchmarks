interface ToBeChecked {
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
 * Check that an object conforms to the schema.
 *
 * Ignore any extra keys in input objects.
 *
 * Such a validation mode is highly unsafe when used on untrusted input.
 *
 * But not checking for unknown/extra keys in records may provide massive
 * speedups and may suffice in certain scenarios.
 */
export declare function assertLoose(input: unknown): boolean;
/**
 * Check that an object conforms to the schema.
 *
 * Raise errors if any extra keys not present in the schema are found.
 */
export declare function assertStrict(): boolean;
/**
 * Like parseSafe but throw on unknown (extra) keys in objects.
 */
export declare function parseStrict(): ToBeChecked;
/**
 * Validate and ignore unknown keys, removing them from the result.
 *
 * When validating untrusted data, unknown keys should always be removed to
 * not result in unwanted parameters or the `__proto__` attribute being
 * maliciously passed to internal functions.
 */
export declare function parseSafe(input: unknown): ToBeChecked;
export {};
