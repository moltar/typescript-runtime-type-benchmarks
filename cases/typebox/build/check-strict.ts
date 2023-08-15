/* eslint-disable */ export const CheckStrict = (() => {return function check(value: any): boolean {
  return (
    (typeof value === 'object' && value !== null) &&
    typeof value.number === 'number' &&
    typeof value.negNumber === 'number' &&
    typeof value.maxNumber === 'number' &&
    (typeof value.string === 'string') &&
    (typeof value.longString === 'string') &&
    (typeof value.boolean === 'boolean') &&
    (typeof value.deeplyNested === 'object' && value.deeplyNested !== null) &&
    (typeof value.deeplyNested.foo === 'string') &&
    typeof value.deeplyNested.num === 'number' &&
    (typeof value.deeplyNested.bool === 'boolean') &&
    Object.getOwnPropertyNames(value.deeplyNested).length === 3 &&
    Object.getOwnPropertyNames(value).length === 7
  )
}})();