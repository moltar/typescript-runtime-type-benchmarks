import { castFunction, getValidatorFunction } from '@deepkit/type';
const __ΩToBeChecked = ['number', 'negNumber', 'maxNumber', 'string', 'longString', 'boolean', 'foo', 'num', 'bool', 'deeplyNested', 'ToBeChecked', 'P\'4!\'4"\'4#&4$&4%)4&P&4\'\'4()4)M4*Mw+y'];
const isToBeChecked = (getValidatorFunction.Ω = [[() => __ΩToBeChecked, 'n!']], getValidatorFunction());
const safeToBeChecked = (castFunction.Ω = [[() => __ΩToBeChecked, 'n!']], castFunction());
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
export function assertLoose(input) {
    if (!isToBeChecked(input))
        throw new Error('wrong type.');
    return true;
}
assertLoose.__type = ['input', 'assertLoose', 'P#2!)/"'];
/**
 * Check that an object conforms to the schema.
 *
 * Raise errors if any extra keys not present in the schema are found.
 */
export function assertStrict() {
    throw new Error('not supported.');
}
assertStrict.__type = ['assertStrict', 'P)/!'];
/**
 * Like parseSafe but throw on unknown (extra) keys in objects.
 */
export function parseStrict() {
    throw new Error('not supported.');
}
parseStrict.__type = [() => __ΩToBeChecked, 'parseStrict', 'Pn!/"'];
/**
 * Validate and ignore unknown keys, removing them from the result.
 *
 * When validating untrusted data, unknown keys should always be removed to
 * not result in unwanted parameters or the `__proto__` attribute being
 * maliciously passed to internal functions.
 */
export function parseSafe(input) {
    return safeToBeChecked(input);
}
parseSafe.__type = ['input', () => __ΩToBeChecked, 'parseSafe', 'P#2!n"/#'];
//# sourceMappingURL=index.js.map