import parse, {
  parseAsBoolean,
  parseAsMutableObject,
  parseAsNumber,
  parseAsString,
} from 'parse-dont-validate';
import { addCase } from '../benchmarks';

addCase('parse-dont-validate (chained function)', 'parseSafe', data =>
  parse(data)
    .asMutableObject(data => ({
      number: parse(data.number).asNumber().elseThrow('number is not a number'),
      negNumber: parse(data.negNumber)
        .asNumber()
        .inRangeOf({
          max: -1,
          min: Number.MIN_SAFE_INTEGER,
        })
        .elseThrow('negNumber is not a number'),
      maxNumber: parse(data.maxNumber)
        .asNumber()
        .inRangeOf({
          min: Number.MAX_VALUE,
          max: Number.MAX_VALUE,
        })
        .elseThrow('maxNumber is not a number'),
      string: parse(data.string).asString().elseThrow('string is not a string'),
      longString: parse(data.longString)
        .asString()
        .elseThrow('longString is not a string'),
      boolean: parse(data.boolean)
        .asBoolean()
        .elseThrow('boolean is not a boolean'),
      deeplyNested: parse(data.deeplyNested)
        .asMutableObject(deeplyNested => ({
          foo: parse(deeplyNested.foo)
            .asString()
            .elseThrow('foo is not a string'),
          num: parse(deeplyNested.num)
            .asNumber()
            .elseThrow('num is not a number'),
          bool: parse(deeplyNested.bool)
            .asBoolean()
            .elseThrow('bool is not a boolean'),
        }))
        .elseThrow('deeplyNested is not an object'),
    }))
    .elseThrow('data is not an object')
);

addCase('parse-dont-validate (named parameters)', 'parseSafe', data =>
  parseAsMutableObject({
    object: data,
    ifParsingFailThen: 'throw',
    message: 'data is not an object',
    parse: data => ({
      number: parseAsNumber({
        number: data.number,
        ifParsingFailThen: 'throw',
        message: 'number is not a number',
      }),
      negNumber: parseAsNumber({
        number: data.negNumber,
        ifParsingFailThen: 'throw',
        message: 'negNumber is not a number',
        inRangeOf: {
          max: -1,
          min: Number.MIN_SAFE_INTEGER,
        },
      }),
      maxNumber: parseAsNumber({
        number: data.maxNumber,
        ifParsingFailThen: 'throw',
        message: 'maxNumber is not a number',
        inRangeOf: {
          min: Number.MAX_VALUE,
          max: Number.MAX_VALUE,
        },
      }),
      string: parseAsString({
        string: data.string,
        ifParsingFailThen: 'throw',
        message: 'string is not a string',
      }),
      longString: parseAsString({
        string: data.longString,
        ifParsingFailThen: 'throw',
        message: 'longString is not a string',
      }),
      boolean: parseAsBoolean({
        boolean: data.boolean,
        ifParsingFailThen: 'throw',
        message: 'boolean is not a boolean',
      }),
      deeplyNested: parseAsMutableObject({
        object: data.deeplyNested,
        parse: deeplyNested => ({
          foo: parseAsString({
            string: deeplyNested.foo,
            ifParsingFailThen: 'throw',
            message: 'foo is not a string',
          }),
          num: parseAsNumber({
            number: deeplyNested.num,
            ifParsingFailThen: 'throw',
            message: 'num is not a number',
          }),
          bool: parseAsBoolean({
            boolean: deeplyNested.bool,
            ifParsingFailThen: 'throw',
            message: 'bool is not a boolean',
          }),
        }),
        ifParsingFailThen: 'throw',
        message: 'deeplyNested is not an object',
      }),
    }),
  })
);
