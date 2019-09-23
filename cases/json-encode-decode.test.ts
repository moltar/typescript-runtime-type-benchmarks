import { caseJsonEncodeDecode } from './json-encode-decode'
import { DATA } from '../data'

describe('json-encode-decode', () => {
  it('should pass', () => {
    expect(caseJsonEncodeDecode(DATA)).toEqual(DATA)
  })
})
