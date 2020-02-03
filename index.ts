import { writeFileSync } from 'fs'
import { join } from 'path'
import { suite, add, cycle, complete, save } from 'benny'
import stringify from 'csv-stringify/lib/sync'
import pkg from './package.json'
import { DATA } from './data'
import CaseClasses from './cases'

const caseInstances = CaseClasses.map(CaseClass => new CaseClass(DATA))

const RESULTS_DIR = join(__dirname, 'results')
const NODE_VERSION = process.env.NODE_VERSION || process.version

suite(
  pkg.name,

  ...caseInstances.map(caseInstance => add(caseInstance.name, () => caseInstance.validate())),

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