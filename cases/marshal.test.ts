import { caseMashal } from './marshal'
import { DATA } from '../data'

describe('caseMashal', () => {
  it('should pass', () => {
    const res = caseMashal(DATA)
    expect(res).toEqual(DATA)

    if (res) {
      expect(res.number).toEqual(DATA.number)
    }
  })

  it('should fail negative number test', () => {
    const req = Object.assign({}, DATA, { neg_number: 1 })
    expect(() => caseMashal(req)).toThrowErrorMatchingSnapshot()
  })

  it('should fail min length test', () => {
    const req = Object.assign({}, DATA, { long_string: '' })
    expect(() => caseMashal(req)).toThrowErrorMatchingSnapshot()
  })
})