import { caseRuntypes } from './runtypes'
import { DATA } from '../data'

describe('runtypes', () => {
  it('should pass', () => {
    const res = caseRuntypes(DATA)
    expect(res).toEqual(DATA)

    if (res) {
      expect(res.number).toEqual(DATA.number)
    }
  })

  it('should fail negative number test', () => {
    const req = Object.assign({}, DATA, { neg_number: 1 })
    expect(() => caseRuntypes(req)).toThrowErrorMatchingSnapshot()
  })

  it('should fail min length test', () => {
    const req = Object.assign({}, DATA, { long_string: '' })
    expect(() => caseRuntypes(req)).toThrowErrorMatchingSnapshot()
  })
})
