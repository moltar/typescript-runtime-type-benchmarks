import { caseIoTs } from './io-ts'
import { DATA } from '../data'

describe('io-ts', () => {
  it('should pass', () => {
    const res = caseIoTs(DATA)
    expect(res).toEqual(DATA)

    if (res) {
      expect(res.number).toEqual(DATA.number)
    }
  })

  it('should fail negative number test', () => {
    const req = Object.assign({}, DATA, { neg_number: 1 })
    expect(() => caseIoTs(req)).toThrowErrorMatchingSnapshot()
  })

  it('should fail min length test', () => {
    const req = Object.assign({}, DATA, { long_string: '' })
    expect(() => caseIoTs(req)).toThrowErrorMatchingSnapshot()
  })
})
