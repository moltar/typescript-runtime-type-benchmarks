#!/usr/bin/env bash

set -eux -o pipefail

# jump into the current script directory
cd "$(dirname "$0")"

# remove the old predicate file if exists
rimraf src/index_guards.ts
# generate a new predicate file (src/index_guards.ts)
type-predicate-generator src/index.ts

# remove the old build files if exists
rimraf build/
# type check and compile to JS
tsc -p tsconfig.json
# minify the resulting compiled source
esbuild --loader=js --minify < build/index_guards.js > build/index_guards.min.js
rimraf build/index_guards.js
mv build/index_guards.min.js build/index_guards.js
