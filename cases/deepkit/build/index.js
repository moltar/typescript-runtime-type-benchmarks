"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSafe = exports.parseStrict = exports.assertStrict = exports.assertLoose = void 0;
const type_1 = require("@deepkit/type");
const __ΩToBeChecked = ['number', 'negNumber', 'maxNumber', 'string', 'longString', 'boolean', 'foo', 'num', 'bool', 'deeplyNested', 'ToBeChecked', 'P\'4!\'4"\'4#&4$&4%)4&P&4\'\'4()4)M4*Mw+y'];
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
function assertLoose(input) {
    if (!(type_1.is.Ω = [[() => __ΩToBeChecked, 'n!']], (0, type_1.is)(input)))
        throw new Error('wrong type.');
    return true;
}
exports.assertLoose = assertLoose;
assertLoose.__type = ['input', 'assertLoose', 'P#2!)/"'];
/**
 * Check that an object conforms to the schema.
 *
 * Raise errors if any extra keys not present in the schema are found.
 */
function assertStrict(input) {
    throw new Error('not supported.');
}
exports.assertStrict = assertStrict;
assertStrict.__type = ['input', 'assertStrict', 'P#2!)/"'];
/**
 * Like parseSafe but throw on unknown (extra) keys in objects.
 */
function parseStrict(input) {
    throw new Error('not supported.');
}
exports.parseStrict = parseStrict;
parseStrict.__type = ['input', () => __ΩToBeChecked, 'parseStrict', 'P#2!n"/#'];
/**
 * Validate and ignore unknown keys, removing them from the result.
 *
 * When validating untrusted data, unknown keys should always be removed to
 * not result in unwanted parameters or the `__proto__` attribute being
 * maliciously passed to internal functions.
 */
function parseSafe(input) {
    if (!(type_1.is.Ω = [[() => __ΩToBeChecked, 'n!']], (0, type_1.is)(input)))
        throw new Error('wrong type.');
    return (type_1.cast.Ω = [[() => __ΩToBeChecked, 'n!']], (0, type_1.cast)(input));
}
exports.parseSafe = parseSafe;
parseSafe.__type = ['input', () => __ΩToBeChecked, 'parseSafe', 'P#2!n"/#'];
//# sourceMappingURL=index.js.map