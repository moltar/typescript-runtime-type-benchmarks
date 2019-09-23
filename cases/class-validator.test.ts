import { caseClassValidatorSync, caseClassValidatorAsync } from './class-validator'
import { DATA } from '../data'

describe('caseClassValidatorSync', () => {
  it('should pass', () => {
    const res = caseClassValidatorSync(DATA)
    expect(res).toEqual(DATA)

    if (res) {
      expect(res.number).toEqual(DATA.number)
    }
  })

  it('should fail negative number test', () => {
    const req = Object.assign({}, DATA, { neg_number: 1 })
    expect(() => caseClassValidatorSync(req)).toThrow()
  })

  it('should fail min length test', () => {
    const req = Object.assign({}, DATA, { long_string: '' })
    expect(() => caseClassValidatorSync(req)).toThrow()
  })
})

describe('caseClassValidatorAsync', () => {
  it('should pass', async () => {
    const res = await caseClassValidatorAsync(DATA)
    expect(res).toEqual(DATA)

    if (res) {
      expect(res.number).toEqual(DATA.number)
    }
  })

  it('should fail negative number test', () => {
    const req = Object.assign({}, DATA, { neg_number: 1 })
    return expect(caseClassValidatorAsync(req)).rejects.toMatchSnapshot()
  })

  it('should fail min length test', () => {
    const req = Object.assign({}, DATA, { long_string: '' })
    return expect(caseClassValidatorAsync(req)).rejects.toMatchSnapshot()
  })
})