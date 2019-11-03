import { caseTsJsonValidator } from './ts-json-validator'
import { DATA } from '../data'

describe('ts-json-validator', () => {
  it('should pass', () => {
    const res = caseTsJsonValidator(DATA)
    expect(res).toEqual(DATA)

    if (res) {
      expect(res.number).toEqual(DATA.number)
    }
  })

  it('should fail negative number test', () => {
    const req = Object.assign({}, DATA, { neg_number: 1 })
    expect(() => caseTsJsonValidator(req)).toThrowErrorMatchingSnapshot()
  })

  it('should fail min length test', () => {
    const req = Object.assign({}, DATA, { long_string: '' })
    expect(() => caseTsJsonValidator(req)).toThrowErrorMatchingSnapshot()
  })
})
