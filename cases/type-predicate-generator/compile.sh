#!/usr/bin/env bash

set -eux -o pipefail

cd "$(dirname "$0")"

rimraf src/index_guards.ts
type-predicate-generator ./src/index.ts

rimraf build/
tsc -p tsconfig.json
