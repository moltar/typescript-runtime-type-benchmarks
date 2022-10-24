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
      number: parse(data.number).asNumber().elseThrow(''),
      negNumber: parse(data.negNumber)
        .asNumber()
        .inRangeOf({
          max: -1,
          min: Number.MIN_SAFE_INTEGER,
        })
        .elseThrow(''),
      maxNumber: parse(data.maxNumber).asNumber().elseThrow(''),
      string: parse(data.string).asString().elseThrow(''),
      longString: parse(data.longString).asString().elseThrow(''),
      boolean: parse(data.boolean).asBoolean().elseThrow(''),
      deeplyNested: parse(data.deeplyNested)
        .asMutableObject(deeplyNested => ({
          foo: parse(deeplyNested.foo).asString().elseThrow(''),
          num: parse(deeplyNested.num).asNumber().elseThrow(''),
          bool: parse(deeplyNested.bool).asBoolean().elseThrow(''),
        }))
        .elseThrow(''),
    }))
    .elseThrow('')
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
      }),
      maxNumber: parseAsNumber({
        number: data.maxNumber,
        ifParsingFailThen: 'get',
        alternativeValue: '',
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
