import { writeFileSync } from 'fs'
import { join } from 'path'
import { suite, add, cycle, complete, save } from 'benny'
import stringify from 'csv-stringify/lib/sync'
import pkg from './package.json'
import { DATA } from './data'
import {
  caseJsonEncodeDecode,
  caseRuntypes,
  caseIoTs,
  caseClassValidatorSync,
  caseClassValidatorAsync,
  caseTsJsonValidator
} from './cases'

const RESULTS_DIR = join(__dirname, 'results')
const NODE_VERSION = process.env.NODE_VERSION || process.version

suite(
  pkg.name,

  add('JSON Encode Decode', () => caseJsonEncodeDecode(DATA)),
  add('runtypes', () => caseRuntypes(DATA)),
  add('io-ts', () => caseIoTs(DATA)),
  add('class-validator sync', () => caseClassValidatorSync(DATA)),
  add('class-validator async', () => caseClassValidatorAsync(DATA)),
  add('ts-json-validator', () => caseTsJsonValidator(DATA)),

  cycle(),
  complete(),

  complete((res) => {
    const csvArr = res.results.map(({ name, ops }) => {
      return { name, ops }
    })

    const csv = stringify(csvArr, {
      header: true,
      columns: ['name', 'ops']
    })

    return writeFileSync(join(RESULTS_DIR, `benchmarks-${NODE_VERSION}.csv`), csv, { encoding: 'utf8' })
  }),

  save({
    file: `benchmarks-${NODE_VERSION}`,
    folder: RESULTS_DIR,
    version: pkg.version,
  })
)