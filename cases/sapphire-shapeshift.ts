import { s } from '@sapphire/shapeshift';
import { createCase } from '../benchmarks';

createCase('@sapphire/shapeshift', 'parseSafe', () => {
  const dataType = s.object({
    number: s.number,
    negNumber: s.number,
    maxNumber: s.number,
    string: s.string,
    longString: s.string,
    boolean: s.boolean,
    deeplyNested: s.object({
      foo: s.string,
      num: s.number,
      bool: s.boolean,
    }),
  });

  return data => {
    return dataType.parse(data);
  };
});

createCase('@sapphire/shapeshift', 'parseStrict', () => {
  const dataType = s.object({
    number: s.number,
    negNumber: s.number,
    maxNumber: s.number,
    string: s.string,
    longString: s.string,
    boolean: s.boolean,
    deeplyNested: s.object({
      foo: s.string,
      num: s.number,
      bool: s.boolean,
    }).strict,
  }).strict;

  return data => {
    return dataType.parse(data);
  };
});

createCase('@sapphire/shapeshift', 'assertLoose', () => {
  const dataType = s.object({
    number: s.number,
    negNumber: s.number,
    maxNumber: s.number,
    string: s.string,
    longString: s.string,
    boolean: s.boolean,
    deeplyNested: s.object({
      foo: s.string,
      num: s.number,
      bool: s.boolean,
    }).passthrough,
  }).passthrough;

  return data => {
    dataType.parse(data);

    return true;
  };
});

createCase('@sapphire/shapeshift', 'assertStrict', () => {
  const dataType = s.object({
    number: s.number,
    negNumber: s.number,
    maxNumber: s.number,
    string: s.string,
    longString: s.string,
    boolean: s.boolean,
    deeplyNested: s.object({
      foo: s.string,
      num: s.number,
      bool: s.boolean,
    }).strict,
  }).strict;

  return data => {
    dataType.parse(data);

    return true;
  };
});
