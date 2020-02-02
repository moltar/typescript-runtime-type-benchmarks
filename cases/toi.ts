import * as toi from '@toi/toi'
import { Data } from '../data'

const isValid = toi
  .required()
  .and(toi.obj.isplain())
  .and(
    toi.obj.keys({
      number: toi.num.is(),
      neg_number: toi.num.max(0),
      max_number: toi.num.max(Number.MAX_VALUE),
      string: toi.str.is(),
      long_string: toi.str.is().and(toi.str.min(100)),
      boolean: toi.bool.is(),
      deeplyNested: toi
        .required()
        .and(toi.obj.isplain())
        .and(toi.obj.keys({
          foo: toi.str.is(),
          num: toi.num.is(),
          bool: toi.bool.is()
        }))
    })
  )

export function caseToi(data: Data) {
  return isValid(data)
}