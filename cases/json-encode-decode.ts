import { Data } from '../data'

export function caseJsonEncodeDecode (data: Data) {
  return JSON.parse(JSON.stringify(data))
}
