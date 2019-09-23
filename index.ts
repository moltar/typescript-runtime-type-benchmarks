import Benchmark from 'benchmark'
import stringify from 'csv-stringify/lib/sync'
import { DATA } from './data'
import { caseJsonEncodeDecode, caseRuntypes, caseIoTs, caseClassValidatorSync, caseClassValidatorAsync } from './cases'
import { writeFileSync } from 'fs'

const suite = new Benchmark.Suite

suite
  .add('JSON Encode Decode', {
    fn: function () {
      return caseJsonEncodeDecode(DATA)
    }
  })
  .add('runtypes', {
    fn: function () {
      return caseRuntypes(DATA)
    }
  })
  .add('io-ts', {
    fn: function () {
      return caseIoTs(DATA)
    }
  })
  .add('class-validator sync', {
    fn: function () {
      return caseClassValidatorSync(DATA)
    }
  })
  .add('class-validator async', {
    defer: true,
    fn: function (deferred: any) {
      return caseClassValidatorAsync(DATA)
        .then((res) => {
          deferred.resolve();
          return res
        })
        .catch((err) => console.error(err))
    }
  })
  .on('complete', function () {
    const csvArr = suite.map((bench: Benchmark) => {
      // No type info for name.
      // @ts-ignore
      const name: string = bench.name
      const { hz } = bench

      return {
        name,
        hz
      }
    })

    const csv = stringify(csvArr, {
      header: true,
      columns: ['name', 'hz']
    })

    process.stdout.write(csv)
  })
  .run({
    async: true
  })
