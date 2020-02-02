import { caseToi } from './toi'
import { DATA } from '../data'

describe('toi', () => {
  it('should pass', () => {
    const res = caseToi(DATA)
    expect(res).toEqual(DATA)

    if (res) {
      expect(res.number).toEqual(DATA.number)
    }
  })

  it('should fail negative number test', () => {
    const req = Object.assign({}, DATA, { neg_number: 1 })
    expect(() => caseToi(req)).toThrowErrorMatchingSnapshot()
  })

  it('should fail min length test', () => {
    const req = Object.assign({}, DATA, { long_string: '' })
    expect(() => caseToi(req)).toThrowErrorMatchingSnapshot()
  })
})
