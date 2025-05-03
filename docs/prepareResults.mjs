// Script to make the benchmark result files accessible to the benchmark viewer app
//
// - keeps them at their current place for easier access tp benchmark
//   history data in the future
// - maybe preprocess and combine them into 1 single file?
import * as fs from 'fs';
import * as path from 'path';

function copyFileSync(src, dest) {
  console.log('copying', src, 'to', dest);
  fs.copyFileSync(src, dest);
}

/* benchmark results */

// older benchmark app builds where based on publishing the whole
// docs folder with github pages
const sourceDir = 'results';

// everything in public can be fetched from the app
const destDir = 'public/results';

if (!fs.existsSync(sourceDir)) {
  console.error('does not exist:', sourceDir);
  process.exit(1);
}

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

const files = fs.readdirSync(sourceDir);

files.forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const destPath = path.join(destDir, file);
  const stats = fs.statSync(sourcePath);

  if (stats.isDirectory()) {
    console.error('did not expect a directory here:', destPath);
    process.exit(1);
  }

  copyFileSync(sourcePath, destPath);
});

/* package popularity file */

copyFileSync('packagesPopularity.json', 'public/packagesPopularity.json');

console.log('done');
process.exit(0);
