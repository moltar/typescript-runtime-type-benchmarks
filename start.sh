#!/bin/sh

set -ex

export NODE_VERSION="${NODE_VERSION:-$(node -v)}"

npm start
cp "results/benchmarks-$NODE_VERSION.csv" benchmarks.csv
npm -s run graph > "results/bar-graph-$NODE_VERSION.svg"
rm benchmarks.csv
