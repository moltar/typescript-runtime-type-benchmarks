import * as childProcess from 'child_process';
import * as benchmarks from './benchmarks';
import * as cases from './cases';

async function main() {
  // a runtype lib would be handy here to check the passed command names ;)
  const [command, ...args] = process.argv.slice(2);

  switch (command) {
    case undefined:
    case 'run':
      // run the given or all benchmarks, each in its own node process, see
      // https://github.com/moltar/typescript-runtime-type-benchmarks/issues/864
      {
        console.log('Removing previous results');
        benchmarks.deleteResults();

        const caseNames = args.length ? args : cases.cases;

        for (const c of caseNames) {
          if (c === 'spectypes') {
            // hack: manually run the spectypes compilation step - avoids
            // having to run it before any other benchmark, esp when working
            // locally and checking against a few selected ones.
            childProcess.execSync('npm run compile:spectypes', {
              stdio: 'inherit',
            });
          }

          const cmd = [...process.argv.slice(0, 2), 'run-internal', c];

          console.log('Executing "%s"', c);
          childProcess.execSync(cmd.join(' '), {
            stdio: 'inherit',
          });
        }
      }
      break;

    case 'create-preview-svg':
      // separate command, because preview generation needs the accumulated
      // results from the benchmark runs
      await benchmarks.createPreviewGraph();
      break;

    case 'run-internal':
      // run the given benchmark(s) & append the results
      {
        const caseNames = args as cases.CaseName[];

        for (const c of caseNames) {
          console.log('Loading "%s"', c);

          await cases.importCase(c);
        }

        await benchmarks.runAllBenchmarks();
      }
      break;

    default:
      console.error('unknown command:', command);

      // eslint-disable-next-line no-process-exit
      process.exit(1);
  }
}

main().catch(e => {
  throw e;
});
