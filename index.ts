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
          // hack: manually run the spectypes and ts-runtime-checks compilation step - avoids
          // having to run it before any other benchmark, esp when working
          // locally and checking against a few selected ones.
          if (c === 'spectypes') {
            childProcess.execSync('npm run compile:spectypes', {
              stdio: 'inherit',
            });
          }
          if (c === 'ts-runtime-checks') {
            childProcess.execSync('npm run compile:ts-runtime-checks', {
              stdio: 'inherit',
            });
          }
          if (c === 'typia') {
            childProcess.execSync('npm run compile:typia', {
              stdio: 'inherit',
            });
          }
          if (c === 'deepkit') {
            childProcess.execSync('npm run compile:deepkit', {
              stdio: 'inherit',
            });
          }
          if (c === 'ts-auto-guard') {
            childProcess.execSync('npm run compile:ts-auto-guard', {
              stdio: 'inherit',
            });
          }
          if (c === 'type-predicate-generator') {
            childProcess.execSync('npm run compile:type-predicate-generator', {
              stdio: 'inherit',
            });
          }
          if (c === 'paseri') {
            childProcess.execSync('npm run compile:paseri', {
              stdio: 'inherit',
            });
          }

          const cmd = [...process.argv.slice(0, 2), 'run-internal', c];

          console.log('Executing "%s"', c);

          childProcess.execFileSync(cmd[0], cmd.slice(1), {
            shell: false,
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

      //eslint-disable-next-line n/no-process-exit
      process.exit(1);
  }
}

main().catch(e => {
  throw e;
});
